import { QueryHandler, IQueryHandler, EventBus } from '@nestjs/cqrs';

import {
  NotFoundException,
  UnauthorizedException,
} from 'src/common/exceptions';
import { GetVideoTreeQuery } from '../impl/get-video-tree.query';
import { VideoTreeWatchedEvent } from '../../events/impl/video-tree-watched.event';
import { VideoTreeRepository } from '../../repositories/video-tree.repository';

@QueryHandler(GetVideoTreeQuery)
export class GetVideoTreeHandler implements IQueryHandler<GetVideoTreeQuery> {
  constructor(
    private readonly repository: VideoTreeRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ id, ip, userId }: GetVideoTreeQuery) {
    const videoTree = await this.repository.findOneWithDataById(id);

    if (!videoTree) {
      throw new NotFoundException('VideoTree not found');
    }

    if (videoTree.status === 'private' && videoTree.userId !== userId) {
      throw new UnauthorizedException('Unable to access private content');
    }

    this.eventBus.publish(new VideoTreeWatchedEvent(id, ip, userId));

    return videoTree;
  }
}
