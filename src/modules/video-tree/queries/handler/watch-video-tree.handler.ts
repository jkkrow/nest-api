import { QueryHandler, IQueryHandler, EventBus } from '@nestjs/cqrs';

import {
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from 'src/common/exceptions';
import { WatchVideoTreeQuery } from '../impl/watch-video-tree.query';
import { VideoTreeWatchedEvent } from '../../events/impl/video-tree-watched.event';
import { VideoTreeRepository } from '../../repositories/video-tree.repository';

@QueryHandler(WatchVideoTreeQuery)
export class WatchVideoTreeHandler
  implements IQueryHandler<WatchVideoTreeQuery>
{
  constructor(
    private readonly repository: VideoTreeRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ id, ip, userId }: WatchVideoTreeQuery) {
    const videoTree = await this.repository.findOneWithData(
      { where: { id } },
      userId,
    );

    if (!videoTree) {
      throw new NotFoundException('VideoTree not found');
    }

    if (videoTree.editing && videoTree.creatorId !== userId) {
      throw new BadRequestException('Unable to access content being edited');
    }

    // TODO: Add validation logic for private video
    if (videoTree.status === 'private' && videoTree.creatorId !== userId) {
      throw new UnauthorizedException('Unable to access private content');
    }

    this.eventBus.publish(new VideoTreeWatchedEvent(id, ip, userId));

    return videoTree;
  }
}
