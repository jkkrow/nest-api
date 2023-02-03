import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetFavoritedVideoTreesQuery } from '../impl/get-favorited-video-trees.query';
import { VideoTreeRepository } from '../../repositories/video-tree.repository';

@QueryHandler(GetFavoritedVideoTreesQuery)
export class GetFavoritedVideoTreesHandler
  implements IQueryHandler<GetFavoritedVideoTreesQuery>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ userId, params }: GetFavoritedVideoTreesQuery) {
    return this.repository.findWithData(
      {
        relation: {
          table: 'favorites',
          condition: { 'favorites.video_id': 'id' },
        },
        where: { 'favorites.user_id': userId, editing: false },
        orderBy: { 'favorites.created_at': 'DESC' },
        pagination: params,
      },
      userId,
    );
  }
}
