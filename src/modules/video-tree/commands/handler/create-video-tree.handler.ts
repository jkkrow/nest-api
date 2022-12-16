import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateVideoTreeCommand } from '../impl/create-video-tree.command';
import { VideoTreeRepository } from '../../models/video-tree.repository';
import { VideoTreeFactory } from '../../models/video-tree.factory';

@CommandHandler(CreateVideoTreeCommand)
export class CreateVideoTreeHandler
  implements ICommandHandler<CreateVideoTreeCommand>
{
  constructor(
    private readonly repository: VideoTreeRepository,
    private readonly factory: VideoTreeFactory,
  ) {}

  async execute({ id, userId }: CreateVideoTreeCommand) {
    const videoTree = this.factory.create({ id, creatorId: userId });

    await this.repository.save(videoTree);

    videoTree.commit();
  }
}
