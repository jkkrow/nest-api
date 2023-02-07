import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { In } from 'typeorm';

import { GetVideoTreesQuery } from '../impl/get-video-trees.query';
import { VideoTreeRepository } from '../../repositories/video-tree.repository';

@QueryHandler(GetVideoTreesQuery)
export class GetVideoTreesHandler implements IQueryHandler<GetVideoTreesQuery> {
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ options, params, userId }: GetVideoTreesQuery) {
    const { ids } = options;
    const filterIds = ids?.length ? { id: In(ids) } : { status: 'public' };
    return this.repository.findWithData(
      {
        where: { editing: false, ...filterIds },
        orderBy: { createdAt: 'DESC', id: 'DESC' },
        pagination: params,
      },
      userId,
    );
  }
}
