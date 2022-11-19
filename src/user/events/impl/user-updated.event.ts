import { IEvent } from '@nestjs/cqrs';

import { IUser } from '../../interfaces/user.interface';

export class UserUpdatedEvent implements IEvent {
  constructor(
    public readonly id: string,
    public readonly updates: Partial<IUser>,
  ) {}
}
