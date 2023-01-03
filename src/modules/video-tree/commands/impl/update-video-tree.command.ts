import { ICommand } from '@nestjs/cqrs';

import { UpdateVideoTreeProps } from '../../interfaces/video-tree';

export class UpdateVideoTreeCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly updates: UpdateVideoTreeProps,
  ) {}
}
