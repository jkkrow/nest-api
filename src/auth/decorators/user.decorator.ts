import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { NotFoundException } from 'src/common/exceptions';
import { IRequestWithUser } from '../interfaces/user.interface';

export const RequestUserId = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const { userId } = context.switchToHttp().getRequest<IRequestWithUser>();

    return userId;
  },
);

export const RequestUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest<IRequestWithUser>();

    if (!user) {
      throw new NotFoundException('Require user authentication');
    }

    return user;
  },
);
