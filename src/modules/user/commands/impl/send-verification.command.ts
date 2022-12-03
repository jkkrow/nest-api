import { ICommand } from '@nestjs/cqrs';

export class SendVerificationCommand implements ICommand {
  constructor(public readonly email: string) {}
}
