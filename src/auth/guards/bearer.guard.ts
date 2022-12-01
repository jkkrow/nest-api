import { CanActivate, ExecutionContext } from '@nestjs/common';

import { JwtService } from 'src/auth/services/jwt.service';
import { IRequestWithUser } from 'src/auth/interfaces/user.interface';

export class BearerGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<IRequestWithUser>();
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
