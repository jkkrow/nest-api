import { Injectable, ExecutionContext } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import dayjs from 'dayjs';

import {
  RequestWithUser,
  RequestUser,
} from 'src/auth/interfaces/user.interface';
import { GetUserQuery } from 'src/modules/user/queries/impl/get-user.query';

@Injectable()
export class ConvertGuard {
  constructor(private readonly queryBus: QueryBus) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const key = request.body.detail.object.key.replace(/\+/g, ' ');
    const userId = key.split('/')[1];

    const query = new GetUserQuery(userId);
    const user = await this.queryBus.execute<GetUserQuery, RequestUser>(query);

    const isMember = user.membership
      ? dayjs().isBefore(user.membership.expiresIn)
      : false;

    return isMember;
  }
}
