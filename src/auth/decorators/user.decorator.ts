import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { NotFoundException } from 'src/common/exceptions';
import { RequestWithUser } from '../interfaces/user.interface';

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
