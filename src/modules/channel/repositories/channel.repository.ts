import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { IChannel } from '../interfaces/channel.interface';

@Injectable()
export class ChannelRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findOneById(id: string, userId?: string) {
    return this.getChannelQuery(userId)
      .where('u_channel.id = :id', { id })
      .getRawOne<IChannel>();
  }

  async findByPublisherId(id: string, page = 1, max = 12) {
    const query = this.getChannelQuery(id)
      .innerJoin('subscriptions', 's', 's.subscriber_id = u_channel.id')
      .where('s.publisher_id = :id', { id })
      .addGroupBy('s.created_at')
      .orderBy('s.created_at', 'DESC')
      .limit(max)
      .offset(max * (page - 1));

    const [channels, count] = await Promise.all([
      query.getRawMany<IChannel>(),
      query.getCount(),
    ]);

    return { channels, count };
  }

  async findBySubscriberId(id: string, page = 1, max = 12) {
    const query = this.getChannelQuery(id)
      .innerJoin('subscriptions', 's', 's.publisher_id = u_channel.id')
      .where('s.subscriber_id = :id', { id })
      .addGroupBy('s.created_at')
      .orderBy('s.created_at', 'DESC')
      .limit(max)
      .offset(max * (page - 1));

    const [channels, count] = await Promise.all([
      query.getRawMany<IChannel>(),
      query.getCount(),
    ]);

    return { channels, count };
  }

  private getChannelQuery(userId?: string) {
    const subscribedQuery = this.dataSource
      .createQueryBuilder()
      .select('s_subscribed.id')
      .from('subscriptions', 's_subscribed')
      .innerJoin(
        'users',
        'u_subscribed',
        'u_subscribed.id = s_subscribed.subscriber_id AND s_subscribed.publisher_id = u_channel.id',
      )
      .where('s_subscribed.subscriber_id = :subscriberId', {
        subscriberId: userId,
      });

    const channelQuery = this.dataSource
      .createQueryBuilder()
      .select([
        'u_channel.id AS id',
        'u_channel.name AS name',
        'u_channel.picture AS picture',
        'COUNT(DISTINCT s_channel.subscriber_id) AS subscribers',
        `EXISTS(${subscribedQuery.getQuery()}) AS subscribed`,
      ])
      .from('users', 'u_channel')
      .leftJoin(
        'subscriptions',
        's_channel',
        's_channel.publisher_id = u_channel.id',
      )
      .groupBy('u_channel.id')
      .setParameters(subscribedQuery.getParameters());

    return channelQuery;
  }
}
