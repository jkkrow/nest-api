import { IEvent } from '@nestjs/cqrs';

export class VideoTreeWatchedEvent implements IEvent {
  constructor(
    public readonly id: string,
    public readonly ip: string,
    public readonly userId?: string,
  ) {}
}
