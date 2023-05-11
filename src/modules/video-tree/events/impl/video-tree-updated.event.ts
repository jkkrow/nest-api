import { IEvent } from '@nestjs/cqrs';

import { UpdateVideoTreeProps } from '../../interfaces/video-tree';

export class VideoTreeUpdatedEvent implements IEvent {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly updates: UpdateVideoTreeProps,
  ) {}
}
