import { ICommand } from '@nestjs/cqrs';

export class CreateVideoNodeCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly treeId: string,
    public readonly parentId: string,
    public readonly userId: string,
  ) {}
}
