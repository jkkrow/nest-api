import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IRole, ROLE_KEY } from '../interfaces/role.interface';
import { RequestWithUser } from '../middlewares/user.middleware';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRole = this.reflector.getAllAndOverride<IRole>(ROLE_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();
    const roles = this.validateUserRole(user);

    return roles[requiredRole];
  }

  private validateUserRole(user: IUser) {
    const roles: Record<IRole, boolean> = {
      verified: false,
      premium: false,
      admin: false,
    };

    if (!user) {
      return roles;
    }

    if (user.verified) {
      roles.verified = true;
    }

    if (user.premium && new Date(user.premium.expiredAt) > new Date()) {
      roles.premium = true;
    }

    if (user.admin) {
      roles.admin = true;
    }

    return roles;
  }
}
