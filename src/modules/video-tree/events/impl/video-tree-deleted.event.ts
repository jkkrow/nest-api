import { IEvent } from '@nestjs/cqrs';

export class VideoTreeDeletedEvent implements IEvent {
  constructor(public readonly id: string, public readonly userId: string) {}
}
