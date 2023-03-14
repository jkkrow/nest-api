import { ICommand } from '@nestjs/cqrs';

export class DeleteUserCommand implements ICommand {
  constructor(public readonly id: string, public readonly password: string) {}
}
