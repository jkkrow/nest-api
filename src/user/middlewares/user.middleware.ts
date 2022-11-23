import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

import { JWTService } from 'src/auth/services/jwt.service';
import { RequestWithUser } from '../interfaces/request.interface';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JWTService) {}

  async use(req: RequestWithUser, _: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const { authorization } = req.headers;

    const token = authorization ? authorization.split('Bearer ')[1] : '';

    if (!token) {
      return next();
    }

    const { userId, sub } = this.jwtService.verify(token);

    if (sub !== 'access') {
      return next();
    }

    req.userId = userId;

    next();
  }
}
