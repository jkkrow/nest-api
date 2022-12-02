import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChannelEntity } from '../entities/channel.entity';
import { SubscriptionEntity } from '../entities/subscription.entity';
import { IChannel } from '../interfaces/channel.interface';

@Injectable()
export class ChannelRepository {
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: Repository<ChannelEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
  ) {}

  async findOneById(id: string, userId?: string) {
    const subscribed = this.subscriptionRepository
      .createQueryBuilder('subscription')
      .select('subscription.id')
      .where('publisher_id = :publisherId', { publisherId: id })
      .andWhere('subscriber_id = :subscriberId', { subscriberId: userId });

    const result = await this.channelRepository
      .createQueryBuilder('channel')
      .select('channel.*')
      .addSelect(`EXISTS (${subscribed.getQuery()})`, 'subscribed')
      .where('channel.id = :id', { id })
      .setParameters(subscribed.getParameters())
      .getRawOne<IChannel>();

    return result;
  }
}
