import { ICommand } from '@nestjs/cqrs';

export class UpdatePictureCommand implements ICommand {
  constructor(public readonly id: string, public readonly picture: string) {}
}
