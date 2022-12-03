import { ICommand } from '@nestjs/cqrs';

export class SendRecoveryCommand implements ICommand {
  constructor(public readonly email: string) {}
}
