import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RoleName, ROLE_KEY } from '../constants/role.constant';
import { RequestWithUser } from '../../user/middlewares/user.middleware';
import { IUser } from '../../user/interfaces/user.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRole = this.reflector.getAllAndOverride<RoleName>(ROLE_KEY, [
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

  private validateUserRole(user?: IUser) {
    const roles: Record<RoleName, boolean> = {
      verified: false,
      member: false,
      admin: false,
    };

    if (!user) {
      return roles;
    }

    if (user.verified) {
      roles.verified = true;
    }

    if (user.membership && new Date(user.membership.expiredAt) > new Date()) {
      roles.member = true;
    }

    if (user.admin) {
      roles.admin = true;
    }

    return roles;
  }
}
