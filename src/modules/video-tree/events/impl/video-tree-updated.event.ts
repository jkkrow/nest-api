import { IEvent } from '@nestjs/cqrs';

export class VideoTreeUpdatedEvent implements IEvent {
  constructor(public readonly id: string) {}
}
