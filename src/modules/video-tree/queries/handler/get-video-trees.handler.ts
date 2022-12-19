import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetVideoTreesQuery } from '../impl/get-video-trees.query';
import { VideoTreeRepository } from '../../repositories/video-tree.repository';

@QueryHandler(GetVideoTreesQuery)
export class GetVideoTreesHandler implements IQueryHandler<GetVideoTreesQuery> {
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ options, params, userId }: GetVideoTreesQuery) {
    if (options.ids) {
      return;
    }

    return this.repository.findWithData(
      {
        where: { editing: false, status: 'public' },
        orderBy: { createdAt: 'DESC' },
        pagination: params,
      },
      userId,
    );
  }
}
