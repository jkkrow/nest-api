import { ICommand } from '@nestjs/cqrs';

export class CheckVerificationCommand implements ICommand {
  constructor(public readonly token: string) {}
}
