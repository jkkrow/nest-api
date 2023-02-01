import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetChannelVideoTreesQuery } from '../impl/get-channel-video-trees.query';
import { VideoTreeRepository } from '../../repositories/video-tree.repository';

@QueryHandler(GetChannelVideoTreesQuery)
export class GetChannelVideoTreesHandler
  implements IQueryHandler<GetChannelVideoTreesQuery>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ channelId, params, userId }: GetChannelVideoTreesQuery) {
    return this.repository.findWithData(
      {
        where: { creatorId: channelId, editing: false },
        orderBy: { createdAt: 'DESC' },
        pagination: params,
      },
      userId,
    );
  }
}
