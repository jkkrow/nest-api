import { ICommand } from '@nestjs/cqrs';

import { UpdateVideoNodeProps } from '../../interfaces/video-node';

export class UpdateVideoNodesCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly treeId: string,
    public readonly userId: string,
    public readonly updates: UpdateVideoNodeProps,
  ) {}
}
