import { IEvent } from '@nestjs/cqrs';

export class VideoTreeCreatedEvent implements IEvent {
  constructor(public readonly id: string) {}
}
