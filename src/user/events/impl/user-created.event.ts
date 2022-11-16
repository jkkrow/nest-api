import { IEvent } from '@nestjs/cqrs';

export class UserCreatedEvent implements IEvent {
  constructor(public readonly id: string, public readonly email: string) {}
}
