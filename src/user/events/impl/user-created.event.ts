import { IEvent } from '@nestjs/cqrs';

import { IUser } from '../../interfaces/user.interface';

export class UserCreatedEvent implements IEvent {
  constructor(
    public readonly id: string,
    public readonly type: IUser['type'],
    public readonly email: string,
  ) {}
}
