import { ICommand } from '@nestjs/cqrs';

import { UpdateVideoNodeProps } from '../../interfaces/video-node';

export class UpdateVideoNodeCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly treeId: string,
    public readonly updates: UpdateVideoNodeProps,
    public readonly userId: string,
  ) {}
}
