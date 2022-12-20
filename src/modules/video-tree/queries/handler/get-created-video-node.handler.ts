import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { NotFoundException } from 'src/common/exceptions';
import { GetCreatedVideoNodeQuery } from '../impl/get-created-video-node.query';
import { VideoTreeRepository } from '../../repositories/video-tree.repository';

@QueryHandler(GetCreatedVideoNodeQuery)
export class GetCreatedVideoNodeHandler
  implements IQueryHandler<GetCreatedVideoNodeQuery>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ id, treeId, creatorId }: GetCreatedVideoNodeQuery) {
    const videoNode = await this.repository.findOneNode(
      {
        where: { id: treeId, creatorId },
      },
      id,
    );

    if (!videoNode) {
      throw new NotFoundException('VideoNode not found');
    }

    return videoNode;
  }
}
