import { ICommand } from '@nestjs/cqrs';

export class CheckRecoveryCommand implements ICommand {
  constructor(public readonly token: string) {}
}
