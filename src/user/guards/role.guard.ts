import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requriedRoles = this.reflector.getAllAndOverride('roles', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (requriedRoles) {
      return true;
    }
  }
}
