import { ICommand } from '@nestjs/cqrs';

export class RemoveFromFavoritesCommand implements ICommand {
  constructor(
    public readonly videoId: string,
    public readonly userId: string,
  ) {}
}
