import { ICommand } from '@nestjs/cqrs';

export class UnsubscribeChannelCommand implements ICommand {
  constructor(
    public readonly publisherId: string,
    public readonly subscriberId: string,
  ) {}
}
