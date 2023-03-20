import path from 'path';

import { typeOrmConfig } from './database.config';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { MembershipEntity } from 'src/modules/user/entities/membership.entity';
import { VideoNodeEntity } from 'src/modules/video-tree/entities/video-node.entity';
import { VideoTreeEntity } from 'src/modules/video-tree/entities/video-tree.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { SubscriptionEntity } from 'src/modules/channel/entities/subscription.entity';
import { FavoriteEntity } from 'src/modules/video-tree/entities/favorite.entity';

export default {
  ...typeOrmConfig,
  entities: [
    UserEntity,
    MembershipEntity,
    VideoNodeEntity,
    VideoTreeEntity,
    CategoryEntity,
    SubscriptionEntity,
    FavoriteEntity,
  ],
  factories: [path.join(__dirname, '../seeding/factories/*.{ts,js}')],
  seeds: [path.join(__dirname, '../seeding/seeds/*.{ts,js}')],
};
