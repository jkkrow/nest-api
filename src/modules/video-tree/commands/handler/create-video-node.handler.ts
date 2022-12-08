import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  NotFoundException,
  UnauthorizedException,
} from 'src/common/exceptions';
import { CreateVideoNodeCommand } from '../impl/create-video-node.command';
import { VideoTreeRepository } from '../../models/video-tree.repository';

@CommandHandler(CreateVideoNodeCommand)
export class CreateVideoNodeHandler
  implements ICommandHandler<CreateVideoNodeCommand>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ id, treeId, parentId, userId }: CreateVideoNodeCommand) {
    const videoTree = await this.repository.findById(treeId);

    if (!videoTree) {
      throw new NotFoundException('VideoTree not found');
    }

    if (videoTree.userId !== userId) {
      throw new UnauthorizedException('VideoTree not belong to user');
    }

    videoTree.createNode(id, parentId);

    await this.repository.save(videoTree);

    videoTree.commit();
  }
}
