import { ICommand } from '@nestjs/cqrs';

import { IVideoTree } from '../../interfaces/video-tree';

export class UpdateVideoTreeCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly updates: IVideoTree,
    public readonly userId: string,
  ) {}
}
