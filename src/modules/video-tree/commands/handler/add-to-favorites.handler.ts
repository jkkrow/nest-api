import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AddToFavoritesCommand } from '../impl/add-to-favorites.command';
import { FavoriteService } from '../../services/favorites.service';

@CommandHandler(AddToFavoritesCommand)
export class AddToFavoritesHandler
  implements ICommandHandler<AddToFavoritesCommand>
{
  constructor(private readonly favoriteService: FavoriteService) {}

  async execute({ videoId, userId }: AddToFavoritesCommand) {
    await this.favoriteService.add(videoId, userId);
  }
}
