import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  NotFoundException,
  UnauthorizedException,
} from 'src/common/exceptions';
import { DeleteVideoTreeCommand } from '../impl/delete-video-tree.command';
import { VideoTreeRepository } from '../../models/video-tree.repository';

@CommandHandler(DeleteVideoTreeCommand)
export class DeleteVideoTreeHandler
  implements ICommandHandler<DeleteVideoTreeCommand>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ id, userId }: DeleteVideoTreeCommand) {
    const videoTree = await this.repository.findById(id);

    if (!videoTree) {
      throw new NotFoundException('VideoTree not found');
    }

    if (videoTree.userId !== userId) {
      throw new UnauthorizedException('VideoTree not belong to user');
    }

    videoTree.delete();

    await this.repository.delete(videoTree);

    videoTree.commit();
  }
}
