import { Seeder, Factory } from 'typeorm-seeding';

import { FavoriteEntity } from 'src/modules/video-tree/entities/favorite.entity';
import { FavoriteContext } from '../factories/favorite.factory';

export default class CreateFavorites implements Seeder {
  async run(factory: Factory) {
    await factory<FavoriteEntity, FavoriteContext>(FavoriteEntity)().createMany(
      100,
    );
  }
}
