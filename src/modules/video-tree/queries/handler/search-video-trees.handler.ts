import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { SearchVideoTreesQuery } from '../impl/search-video-trees.query';
import { VideoTreeRepository } from '../../repositories/video-tree.repository';

@QueryHandler(SearchVideoTreesQuery)
export class SearchVideoTreesHandler
  implements IQueryHandler<SearchVideoTreesQuery>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ keyword, params, userId }: SearchVideoTreesQuery) {
    return this.repository.findWithData(
      {
        where: { editing: false },
        search: keyword,
        pagination: params,
      },
      userId,
    );
  }
}
