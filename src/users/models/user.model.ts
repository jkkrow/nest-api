import { AggregateRoot } from '@nestjs/cqrs';

import { UserCreatedEvent } from '../events/impl/user-created.event';

export class User extends AggregateRoot {
  constructor() {
    super();
  }

  createUser(userId: string) {
    this.apply(new UserCreatedEvent(userId));
  }
}
