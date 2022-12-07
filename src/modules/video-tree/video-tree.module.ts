import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from 'src/providers/database/database.module';
import { VideoTreeController } from './controllers/video-tree.controller';
import { CommandHandlers } from './commands/handler';
import { EventHandlers } from './events/handler';
import { VideoTreeSaga } from './sagas/video-tree.saga';
import { VideoTreeEntity } from './entities/video-tree.entity';
import { VideoNodeEntity } from './entities/video-node.entity';
import { VideoTreeFactory } from './models/video-tree.factory';
import { VideoTreeRepository } from './models/video-tree.repository';

@Module({
  imports: [
    DatabaseModule.forFeature([VideoTreeEntity, VideoNodeEntity]),
    CqrsModule,
  ],
  controllers: [VideoTreeController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    VideoTreeSaga,
    VideoTreeFactory,
    VideoTreeRepository,
  ],
})
export class VideoTreeModule {}
