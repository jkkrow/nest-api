import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  NotFoundException,
  UnauthorizedException,
} from 'src/common/exceptions';
import { UpdateVideoTreeCommand } from '../impl/update-video-tree.command';
import { VideoTreeRepository } from '../../models/video-tree.repository';

@CommandHandler(UpdateVideoTreeCommand)
export class UpdateVideoTreeHandler
  implements ICommandHandler<UpdateVideoTreeCommand>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ id, updates, userId }: UpdateVideoTreeCommand) {
    const videoTree = await this.repository.findOneById(id);

    if (!videoTree) {
      throw new NotFoundException('VideoTree not found');
    }

    if (videoTree.creatorId !== userId) {
      throw new UnauthorizedException('VideoTree not belong to user');
    }

    videoTree.update(updates);

    await this.repository.save(videoTree);

    videoTree.commit();
  }
}
