import { Injectable, NestMiddleware } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Request, Response, NextFunction } from 'express';

import { JWTService } from 'src/auth/services/jwt.service';
import { GetUserQuery } from '../queries/impl/get-user.query';
import { IUser } from '../interfaces/user.interface';

export interface RequestWithUser extends Request {
  user?: IUser;
}

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly jwtService: JWTService,
  ) {}

  async use(req: RequestWithUser, _: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') return next();

    const { authorization } = req.headers;

    const token = authorization ? authorization.split('Bearer ')[1] : '';

    if (token) {
      return next();
    }

    const result = this.jwtService.verify(token);

    if (result.sub !== 'access') {
      return next();
    }

    const user = await this.queryBus.execute<GetUserQuery, IUser>(
      new GetUserQuery(result.userId),
    );

    req.user = user;

    next();
  }
}
