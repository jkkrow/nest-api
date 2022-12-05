import { ICommand } from '@nestjs/cqrs';

export class CreateVideoTreeCommand implements ICommand {
  constructor(public readonly id: string, public readonly userId: string) {}
}
