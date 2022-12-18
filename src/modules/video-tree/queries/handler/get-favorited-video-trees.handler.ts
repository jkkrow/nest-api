import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetFavoritedVideoTreesQuery } from '../impl/get-favorited-video-trees.query';
import { VideoTreeRepository } from '../../repositories/video-tree.repository';

@QueryHandler(GetFavoritedVideoTreesQuery)
export class GetFavoritedVideoTreesHandler
  implements IQueryHandler<GetFavoritedVideoTreesQuery>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ userId, params }: GetFavoritedVideoTreesQuery) {
    return await this.repository.findWithData(
      {
        where: { editing: false, 'favorite.user_id': userId },
        orderBy: { 'favorite.created_at': 'DESC' },
        pagination: params,
      },
      userId,
    );
  }
}
