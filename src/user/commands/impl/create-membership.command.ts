import { ICommand } from '@nestjs/cqrs';

export class CreateMembershipCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly subscriptionId: string,
  ) {}
}
