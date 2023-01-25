import { CanActivate, ExecutionContext } from '@nestjs/common';

import { JwtService } from 'src/auth/services/jwt.service';
import { RequestWithUser } from 'src/auth/interfaces/user.interface';
import { UnauthorizedException } from 'src/common/exceptions';

export class BearerGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { authorization } = request.headers;

    const token = authorization ? authorization.split('Bearer ')[1] : '';
    const errorMessage = 'Invalid auth credentials (bearer token)';

    if (!token) {
      throw new UnauthorizedException(errorMessage);
    }

    const { userId } = this.jwtService.verify(token, {
      sub: 'access',
      errorMessage,
    });

    request.userId = userId;

    return true;
  }
}
