import { ICommand } from '@nestjs/cqrs';

export class CancelMembershipCommand implements ICommand {
  constructor(public readonly id: string, public readonly reason?: string) {}
}
