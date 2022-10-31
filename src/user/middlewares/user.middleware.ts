import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { AuthService } from 'src/auth/services/auth.service';

interface UserSession {
  id: string;
}

interface RequestWithUser extends Request {
  user?: UserSession;
}

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: RequestWithUser, _: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') return next();

    const { authorization } = req.headers;

    if (!authorization) {
      return next();
    }

    const token = authorization.split(' ')[1] || '';
    const result = this.authService.verifyToken(token);

    if (result.type !== 'access') {
      return next();
    }

    req.user = { id: result.userId };

    next();
  }
}
