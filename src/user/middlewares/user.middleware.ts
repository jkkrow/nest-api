import { Injectable, NestMiddleware } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Request, Response, NextFunction } from 'express';

import { AuthService } from 'src/auth/services/auth.service';
import { GetUserQuery } from '../queries/impl/get-user.query';
import { IUser } from '../interfaces/user.interface';

export interface RequestWithUser extends Request {
  user?: IUser;
}

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authService: AuthService,
  ) {}

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

    const user = await this.queryBus.execute<GetUserQuery, IUser>(
      new GetUserQuery(result.userId),
    );

    req.user = user;

    next();
  }
}
