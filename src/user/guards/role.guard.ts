import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { QueryBus } from '@nestjs/cqrs';

import { BearerGuard } from 'src/auth/guards/bearer.guard';
import { JwtService } from 'src/auth/services/jwt.service';
import { RoleName, ROLE_KEY } from '../constants/role.constant';
import { RequestWithUser } from '../interfaces/request.interface';
import { GetUserQuery } from '../queries/impl/get-user.query';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class RoleGuard extends BearerGuard {
  constructor(
    private readonly reflector: Reflector,
    private readonly queryBus: QueryBus,
    jwtService: JwtService,
  ) {
    super(jwtService);
  }

  private readonly roles: Record<RoleName, boolean> = {
    user: false,
    verified: false,
    member: false,
    admin: false,
  };

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const requiredRole = this.reflector.getAllAndOverride<RoleName>(ROLE_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!requiredRole) {
      return true;
    }

    if (!request.userId) {
      return false;
    }

    request.user = await this.validateRole(request.userId);

    return this.roles[requiredRole];
  }

  private async validateRole(userId: string) {
    const query = new GetUserQuery(userId);
    const user = await this.queryBus.execute<GetUserQuery, IUser>(query);

    if (!user) {
      return;
    }

    this.roles.user = !!user;
    this.roles.verified = user.verified;
    this.roles.member = this.validateMembership(user);
    this.roles.admin = user.admin;

    return user;
  }

  private validateMembership(user: IUser) {
    const isMember = user.membership
      ? new Date(user.membership.expiredAt) > new Date()
      : false;

    return isMember;
  }
}
