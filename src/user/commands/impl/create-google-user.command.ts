import { ICommand } from '@nestjs/cqrs';

export class CreateGoogleUserCommand implements ICommand {
  constructor(public readonly token: string) {}
}
