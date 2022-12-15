import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetVideoTreesQuery } from '../impl/get-video-trees.query';
import { VideoTreeRepository } from '../../repositories/video-tree.repository';

@QueryHandler(GetVideoTreesQuery)
export class GetVideoTreesHandler implements IQueryHandler<GetVideoTreesQuery> {
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ userId, params }: GetVideoTreesQuery) {
    return await this.repository.findWithData(params, userId);
  }
}
