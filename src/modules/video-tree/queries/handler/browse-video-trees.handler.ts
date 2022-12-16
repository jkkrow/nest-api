import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { BrowseVideoTreesQuery } from '../impl/browse-video-trees.query';
import { VideoTreeRepository } from '../../repositories/video-tree.repository';

@QueryHandler(BrowseVideoTreesQuery)
export class BrowseVideoTreesHandler
  implements IQueryHandler<BrowseVideoTreesQuery>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ params, userId }: BrowseVideoTreesQuery) {
    return await this.repository.findWithData({}, params, userId);
  }
}
