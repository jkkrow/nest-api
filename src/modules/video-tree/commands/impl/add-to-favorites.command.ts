import { ICommand } from '@nestjs/cqrs';

export class AddToFavoritesCommand implements ICommand {
  constructor(
    public readonly videoId: string,
    public readonly userId: string,
  ) {}
}
