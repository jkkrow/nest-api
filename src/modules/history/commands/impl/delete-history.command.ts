import { ICommand } from '@nestjs/cqrs';

export class DeleteHistoryCommand implements ICommand {
  constructor(
    public readonly videoId: string,
    public readonly userId: string,
  ) {}
}
