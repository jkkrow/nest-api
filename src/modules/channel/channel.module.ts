import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from 'src/providers/database/database.module';
import { ChannelController } from './controllers/channel.controller';
import { CommandHandlers } from './commands/handler';
import { QueryHandlers } from './queries/handler';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionService } from './services/subscription.service';
import { ChannelRepository } from './repositories/channel.repository';

@Module({
  imports: [DatabaseModule.forFeature([SubscriptionEntity]), CqrsModule],
  controllers: [ChannelController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    SubscriptionService,
    ChannelRepository,
  ],
})
export class ChannelModule {}
