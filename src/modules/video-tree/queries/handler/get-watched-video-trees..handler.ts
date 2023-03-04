import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetWatchedVideoTreesQuery } from '../impl/get-watched-video-trees.query';
import { VideoTreeRepository } from '../../repositories/video-tree.repository';

@QueryHandler(GetWatchedVideoTreesQuery)
export class GetWatchedVideoTreesHandler
  implements IQueryHandler<GetWatchedVideoTreesQuery>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ userId, params, skipEnded }: GetWatchedVideoTreesQuery) {
    const filterEnded = skipEnded ? { 'histories.ended': false } : {};
    return this.repository.findWithData(
      {
        relation: {
          table: 'histories',
          condition: { 'histories.video_id': 'id' },
        },
        where: { 'histories.user_id': userId, ...filterEnded },
        orderBy: {
          'histories.updated_at': 'DESC',
          'histories.video_id': 'DESC',
          'histories.user_id': 'DESC',
        },
        pagination: params,
      },
      userId,
    );
  }
}
