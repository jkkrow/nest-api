import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

import { RequestWithUser } from '../interfaces/request.interface';

export const CurrentUserId = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const { userId } = context.switchToHttp().getRequest<RequestWithUser>();

    return userId;
  },
);

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    if (!user) {
      throw new NotFoundException('Require user authentication');
    }

    return user;
  },
);
