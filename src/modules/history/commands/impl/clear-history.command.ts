import { ICommand } from '@nestjs/cqrs';

export class ClearHistoryCommand implements ICommand {
  constructor(public readonly userId: string) {}
}
