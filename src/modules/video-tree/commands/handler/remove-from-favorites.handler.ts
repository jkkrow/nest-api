import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { RemoveFromFavoritesCommand } from '../impl/remove-from-favorites.command';
import { FavoriteService } from '../../services/favorites.service';

@CommandHandler(RemoveFromFavoritesCommand)
export class RemoveFromFavoritesHandler
  implements ICommandHandler<RemoveFromFavoritesCommand>
{
  constructor(private readonly favoriteService: FavoriteService) {}

  async execute({ videoId, userId }: RemoveFromFavoritesCommand) {
    await this.favoriteService.remove(videoId, userId);
  }
}
