import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { ChannelController } from './controllers/channel.controller';
import { SubscriptionEntity } from './entities/subscription.entity';
import { ChannelEntity } from './entities/channel.entity';
import { SubscriptionService } from './services/subscription.service';

@Module({
  imports: [DatabaseModule.forFeature([SubscriptionEntity, ChannelEntity])],
  controllers: [ChannelController],
  providers: [SubscriptionService],
})
export class ChannelModule {}
