import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  NotFoundException,
  UnauthorizedException,
} from 'src/common/exceptions';
import { UpdateVideoNodeCommand } from '../impl/update-video-node.command';
import { VideoTreeRepository } from '../../models/video-tree.repository';

@CommandHandler(UpdateVideoNodeCommand)
export class UpdateVideoNodeHandler
  implements ICommandHandler<UpdateVideoNodeCommand>
{
  constructor(private readonly repository: VideoTreeRepository) {}

  async execute({ id, treeId, updates, userId }: UpdateVideoNodeCommand) {
    const videoTree = await this.repository.findOneById(treeId);

    if (!videoTree) {
      throw new NotFoundException('VideoTree not found');
    }

    if (videoTree.creatorId !== userId) {
      throw new UnauthorizedException('VideoTree not belong to user');
    }

    if (!updates.url || (updates.url && updates.url.startsWith('blob'))) {
      const sameFile = videoTree.nodes.find((n) => n.name === updates.name);
      updates.url = sameFile ? sameFile.url : '';
    }

    // TODO: Validate data by comparing to uploaded video in s3

    videoTree.updateNode(id, updates);

    const fileName = updates.name;
    const duplicates = videoTree.nodes.filter((node) => node.name == fileName);
    const ids = duplicates.map((node) => node.id);

    for (const id of ids) {
      videoTree.updateNode(id, updates);
    }

    await this.repository.save(videoTree);

    videoTree.commit();
  }
}
