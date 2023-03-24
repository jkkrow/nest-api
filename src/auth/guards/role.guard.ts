import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { QueryBus } from '@nestjs/cqrs';
import dayjs from 'dayjs';

import {
  ForbiddenException,
  UnauthorizedException,
} from 'src/common/exceptions';
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

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const role = this.reflector.getAllAndOverride<RoleName>(ROLE_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    await super.canActivate(context, true);
    const errorMessage = `Not allowed action except ${role} users`;

    if (!role) {
      return true;
    }

    if (!request.userId) {
      throw new UnauthorizedException(errorMessage);
    }

    const query = new GetUserQuery(request.userId);
    const user = await this.queryBus.execute<GetUserQuery, RequestUser>(query);

    if (!user) {
      throw new UnauthorizedException(errorMessage);
    }

    const userRoles = {
      user: !!user,
      verified: user.verified,
      admin: user.admin,
      member: this.validateMembership(user),
    };

    if (!userRoles[role]) {
      throw new ForbiddenException(errorMessage);
    }

    request.user = user;

    return true;
  }

  private validateMembership(user: RequestUser) {
    const isMember = user.membership
      ? dayjs().isBefore(user.membership.expiresIn)
      : false;

    return isMember;
  }
}
