import { ICommand } from '@nestjs/cqrs';

export class SubscribeChannelCommand implements ICommand {
  constructor(
    public readonly publisherId: string,
    public readonly subscriberId: string,
  ) {}
}
