import { QueryHandler, IQueryHandler, EventBus } from '@nestjs/cqrs';

import { WatchVideoTreeQuery } from '../impl/watch-video-tree.query';
import { VideoTreeWatchedEvent } from '../../events/impl/video-tree-watched.event';

@QueryHandler(WatchVideoTreeQuery)
export class WatchVideoTreeHandler
  implements IQueryHandler<WatchVideoTreeQuery>
{
  constructor(private readonly eventBus: EventBus) {}

  async execute({ id, ip, userId }: WatchVideoTreeQuery) {
    // Get VideoTree

    this.eventBus.publish(new VideoTreeWatchedEvent(id, ip, userId));

    return;
  }
}
