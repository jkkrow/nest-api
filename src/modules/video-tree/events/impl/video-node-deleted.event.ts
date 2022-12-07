import { IEvent } from '@nestjs/cqrs';

export class VideoNodeDeletedEvent implements IEvent {
  constructor(public readonly id: string, public readonly url: string) {}
}
