import { AggregateRoot } from '@nestjs/cqrs';

import { UserCreatedEvent } from './events/impl/user-created.event';
import { IUserPremium } from './interfaces/user.interface';

export class User extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private readonly name: string,
    private readonly email: string,
    private readonly password: string,
    private readonly picture: string,
    private readonly verified: boolean,
    private readonly admin: boolean,
    private readonly primium: IUserPremium | null,
    private readonly subscribers: string[],
  ) {
    super();
  }

  createUser(userId: string) {
    this.apply(new UserCreatedEvent(userId));
  }
}
