import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { QueryBus } from '@nestjs/cqrs';
import dayjs from 'dayjs';

import { GetUserQuery } from 'src/modules/user/queries/impl/get-user.query';
import { BearerGuard } from './bearer.guard';
import { JwtService } from '../services/jwt.service';
import { RoleName, ROLE_KEY } from '../constants/role.constant';
import { RequestWithUser, RequestUser } from '../interfaces/user.interface';

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
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const requiredRole = this.reflector.getAllAndOverride<RoleName>(ROLE_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!requiredRole) {
      return true;
    }

    await super.canActivate(context);

    request.user = await this.validateRole(request.userId as string);

    return this.roles[requiredRole];
  }

  private async validateRole(userId: string) {
    const query = new GetUserQuery(userId);
    const user = await this.queryBus.execute<GetUserQuery, RequestUser>(query);

    if (!user) {
      return;
    }

    this.roles.user = !!user;
    this.roles.verified = user.verified;
    this.roles.member = this.validateMembership(user);
    this.roles.admin = user.admin;

    return user;
  }

  private validateMembership(user: RequestUser) {
    const isMember = user.membership
      ? dayjs().isBefore(user.membership.expiresIn)
      : false;

    return isMember;
  }
}
