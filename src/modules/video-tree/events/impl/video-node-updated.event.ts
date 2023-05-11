import { IEvent } from '@nestjs/cqrs';

import { UpdateVideoNodeProps } from '../../interfaces/video-node';

export class VideoNodeUpdatedEvent implements IEvent {
  constructor(
    public readonly id: string,
    public readonly meta: {
      treeId: string;
      userId: string;
      level: number;
    },
    public readonly updates: UpdateVideoNodeProps,
  ) {}
}
