import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetCreatedVideoTreesQuery } from '../impl/get-created-video-trees.query';
import { VideoTreeRepository } from '../../repositories/video-tree.repository';

@QueryHandler(GetCreatedVideoTreesQuery)
export class GetCreatedVideoTreesHandler
  implements IQueryHandler<GetCreatedVideoTreesQuery>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ creatorId, params }: GetCreatedVideoTreesQuery) {
    return this.repository.findWithData({
      where: { creatorId },
      orderBy: { createdAt: 'DESC' },
      pagination: params,
    });
  }
}
