import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateVideoNodeCommand } from '../impl/create-video-node.command';
import { VideoTreeRepository } from '../../models/video-tree.repository';

@CommandHandler(CreateVideoNodeCommand)
export class CreateVideoNodeHandler
  implements ICommandHandler<CreateVideoNodeCommand>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ id, treeId, parentId }: CreateVideoNodeCommand) {
    const videoTree = await this.repository.findById(treeId);

    videoTree.addNode(id, parentId);

    await this.repository.save(videoTree);

    videoTree.commit();
  }
}
