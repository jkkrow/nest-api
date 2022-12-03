import { ICommand } from '@nestjs/cqrs';

export class DeleteGoogleUserCommand implements ICommand {
  constructor(public readonly id: string, public readonly token: string) {}
}
