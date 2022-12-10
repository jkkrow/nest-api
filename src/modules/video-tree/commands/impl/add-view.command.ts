import { ICommand } from '@nestjs/cqrs';

export class AddViewCommand implements ICommand {
  constructor(
    public readonly videoId: string,
    public readonly ip: string,
    public readonly userId?: string,
  ) {}
}
