import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from 'src/common/exceptions';
import { DeleteVideoNodeCommand } from '../impl/delete-video-node.command';
import { VideoTreeRepository } from '../../models/video-tree.repository';

@CommandHandler(DeleteVideoNodeCommand)
export class DeleteVideoNodeHandler
  implements ICommandHandler<DeleteVideoNodeCommand>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ id, treeId, userId }: DeleteVideoNodeCommand) {
    const videoTree = await this.repository.findById(treeId);

    if (!videoTree) {
      throw new NotFoundException('VideoTree not found');
    }

    if (videoTree.userId !== userId) {
      throw new UnauthorizedException('VideoTree not belong to user');
    }

    if (videoTree.root.id === id) {
      throw new BadRequestException('Root node cannot be deleted');
    }

    videoTree.deleteNode(id);

    await this.repository.save(videoTree);

    videoTree.commit();
  }
}
