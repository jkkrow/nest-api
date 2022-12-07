import { ICommand } from '@nestjs/cqrs';

export class DeleteVideoNodeCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly treeId: string,
    public readonly userId: string,
  ) {}
}
