import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from 'src/providers/database/database.module';
import { VideoTreeController } from './controllers/video-tree.controller';
import { CommandHandlers } from './commands/handler';
import { QueryHandlers } from './queries/handler';
import { EventHandlers } from './events/handler';
import { VideoTreeSaga } from './sagas/video-tree.saga';
import { VideoTreeEntity } from './entities/video-tree.entity';
import { VideoNodeEntity } from './entities/video-node.entity';
import { FavoriteEntity } from './entities/favorite.entity';
import { ViewEntity } from './entities/view.entity';
import { VideoTreeFactory } from './models/video-tree.factory';
import { VideoTreeRepository } from './models/video-tree.repository';
import { VideoTreeRepository as VideoTreeQueryRepository } from './repositories/video-tree.repository';
import { FavoriteService } from './services/favorites.service';
import { ViewService } from './services/view.service';

@Module({
  imports: [
    DatabaseModule.forFeature([
      VideoTreeEntity,
      VideoNodeEntity,
      FavoriteEntity,
      ViewEntity,
    ]),
    CqrsModule,
  ],
  controllers: [VideoTreeController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    VideoTreeSaga,
    VideoTreeFactory,
    VideoTreeRepository,
    VideoTreeQueryRepository,
    FavoriteService,
    ViewService,
  ],
})
export class VideoTreeModule {}
