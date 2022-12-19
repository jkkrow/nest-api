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
        where: { 'histories.user_id': userId, editing: false, ...filterEnded },
        orderBy: { 'histories.updated_at': 'ASC' },
        groupBy: { 'histories.updated_at': true },
        pagination: params,
      },
      userId,
    );
  }
}
