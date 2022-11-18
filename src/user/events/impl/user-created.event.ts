import { IEvent } from '@nestjs/cqrs';

import { UserType } from '../../constants/user.constant';

export class UserCreatedEvent implements IEvent {
  constructor(
    public readonly id: string,
    public readonly type: UserType,
    public readonly email: string,
  ) {}
}
