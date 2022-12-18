import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetWatchedVideoTreesQuery } from '../impl/get-watched-video-trees.query';
import { VideoTreeRepository } from '../../repositories/video-tree.repository';

@QueryHandler(GetWatchedVideoTreesQuery)
export class GetWatchedVideoTreesHandler
  implements IQueryHandler<GetWatchedVideoTreesQuery>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ userId, params, skipEnded }: GetWatchedVideoTreesQuery) {
    const filterEnded = skipEnded ? { 'history.ended': false } : {};
    return await this.repository.findWithData(
      {
        where: { editing: false, 'history.user_id': userId, ...filterEnded },
        orderBy: { 'history.updated_at': 'DESC' },
        pagination: params,
      },
      userId,
    );
  }
}
