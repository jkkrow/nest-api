import { ICommand } from '@nestjs/cqrs';

import { IVideoNode } from '../../interfaces/video-node';

export class UpdateVideoNodeCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly treeId: string,
    public readonly updates: IVideoNode,
    public readonly userId: string,
  ) {}
}
