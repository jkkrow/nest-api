import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../interfaces/role.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    // validate role
  }
}
