import { IEvent } from '@nestjs/cqrs';

export class VideoNodeUpdatedEvent implements IEvent {
  constructor(public readonly id: string) {}
}
