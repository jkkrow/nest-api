import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { NotFoundException } from 'src/common/exceptions';
import { GetCreatedVideoTreeQuery } from '../impl/get-created-video-tree.query';
import { VideoTreeRepository } from '../../repositories/video-tree.repository';

@QueryHandler(GetCreatedVideoTreeQuery)
export class GetCreatedVideoTreeHandler
  implements IQueryHandler<GetCreatedVideoTreeQuery>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ id, creatorId }: GetCreatedVideoTreeQuery) {
    const videoTree = await this.repository.findOne({
      where: { id, creatorId },
    });

    if (!videoTree) {
      throw new NotFoundException('VideoTree not found');
    }

    return videoTree;
  }
}
