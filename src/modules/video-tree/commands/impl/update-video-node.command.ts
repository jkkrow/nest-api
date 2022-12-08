import { ICommand } from '@nestjs/cqrs';

import { UpdateVideoNodeRequest } from '../../dtos/request/update-video-node.request';

export class UpdateVideoNodeCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly treeId: string,
    public readonly updates: UpdateVideoNodeRequest,
    public readonly userId: string,
  ) {}
}
