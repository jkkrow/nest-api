import { IEvent } from '@nestjs/cqrs';

export class VideoNodeCreatedEvent implements IEvent {
  constructor(public readonly id: string) {}
}
