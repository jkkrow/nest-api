import { IEvent } from '@nestjs/cqrs';

import { User } from '../../interfaces/user.interface';

export class UserUpdatedEvent implements IEvent {
  constructor(
    public readonly id: string,
    public readonly updates: Partial<User>,
  ) {}
}
