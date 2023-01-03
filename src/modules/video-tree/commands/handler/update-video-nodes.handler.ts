import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  NotFoundException,
  UnauthorizedException,
} from 'src/common/exceptions';
import { UpdateVideoNodesCommand } from '../impl/update-video-nodes.command';
import { VideoTreeRepository } from '../../models/video-tree.repository';

@CommandHandler(UpdateVideoNodesCommand)
export class UpdateVideoNodesHandler
  implements ICommandHandler<UpdateVideoNodesCommand>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ name, treeId, updates, userId }: UpdateVideoNodesCommand) {
    const videoTree = await this.repository.findOneById(treeId);

    if (!videoTree) {
      throw new NotFoundException('VideoTree not found');
    }

    if (videoTree.creatorId !== userId) {
      throw new UnauthorizedException('VideoTree not belong to user');
    }

    const matchingNodes = videoTree.nodes.filter((node) => node.name == name);
    const ids = matchingNodes.map((node) => node.id);

    for (const id of ids) {
      videoTree.updateNode(id, updates);
    }

    await this.repository.save(videoTree);

    videoTree.commit();
  }
}
