import { Injectable, ExecutionContext } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import dayjs from 'dayjs';

import {
  RequestWithUser,
  RequestUser,
} from 'src/auth/interfaces/user.interface';
import { GetUserQuery } from 'src/modules/user/queries/impl/get-user.query';
import { UploadService } from '../services/upload.service';

@Injectable()
export class ConvertGuard {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly uploadService: UploadService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const response = context.switchToHttp().getResponse<Response>();

    const key = request.body.detail.object.key;
    const { userId, location } = this.uploadService.parseVideoKey(key);

    if (location !== 'source') {
      response.status(200).json({ message: 'No further tasks to do' });
      return false;
    }

    const query = new GetUserQuery(userId);
    const user = await this.queryBus.execute<GetUserQuery, RequestUser>(query);

    const isMember = user.membership
      ? dayjs().isBefore(user.membership.expiresIn)
      : false;

    return isMember;
  }
}
