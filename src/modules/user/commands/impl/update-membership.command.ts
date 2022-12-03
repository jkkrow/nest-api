import { ICommand } from '@nestjs/cqrs';

export class UpdateMembershipCommand implements ICommand {
  constructor(public readonly subscriptionId: string) {}
}
