import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from 'src/providers/database/database.module';
import { HistoryController } from './controllers/history.controller';
import { CommandHandlers } from './commands/handler';
import { QueryHandlers } from './queries/handler';
import { HistoryEntity } from './entities/history.entity';
import { HistoryService } from './services/history.service';
import { HistoryRepository } from './repositories/history.repository';

@Module({
  imports: [DatabaseModule.forFeature([HistoryEntity]), CqrsModule],
  controllers: [HistoryController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    HistoryService,
    HistoryRepository,
  ],
})
export class HistoryModule {}
