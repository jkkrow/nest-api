import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { JwtService } from 'src/auth/services/jwt.service';
import { RequestWithUser } from 'src/user/interfaces/request.interface';

@Injectable()
export class BearerGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { authorization } = request.headers;

    const token = authorization ? authorization.split('Bearer ')[1] : '';

    if (!token) {
      return false;
    }

    const { userId } = this.jwtService.verify(token, { sub: 'access' });

    request.userId = userId;

    return true;
  }
}
