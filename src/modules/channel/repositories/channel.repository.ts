import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { IChannel } from '../interfaces/channel.interface';

@Injectable()
export class ChannelRepository {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async findOneById(id: string, userId?: string) {
    return this.getChannelQuery(userId)
      .where('c_user.id = :id', { id })
      .getRawOne<IChannel>();
  }

  async findByPublisherId(id: string, page = 1, max = 12) {
    const query = this.getChannelQuery(id)
      .innerJoin('subscriptions', 'q_subs', 'q_subs.subscriber_id = c_user.id')
      .where('q_subs.publisher_id = :id', { id })
      .addGroupBy('q_subs.created_at')
      .orderBy('q_subs.created_at', 'DESC')
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
      .innerJoin('subscriptions', 'q_subs', 'q_subs.publisher_id = c_user.id')
      .where('q_subs.subscriber_id = :id', { id })
      .addGroupBy('q_subs.created_at')
      .orderBy('q_subs.created_at', 'DESC')
      .limit(max)
      .offset(max * (page - 1));

    const [channels, count] = await Promise.all([
      query.getRawMany<IChannel>(),
      query.getCount(),
    ]);

    return { channels, count };
  }

  private getChannelQuery(userId?: string) {
    const subscribedQuery = this.entityManager
      .createQueryBuilder()
      .select('*')
      .from('subscriptions', 's_subs')
      .innerJoin(
        'users',
        's_user',
        's_user.id = s_subs.subscriber_id AND s_subs.publisher_id = c_user.id',
      )
      .where('s_subs.subscriber_id = :userId', { userId });

    const channelQuery = this.entityManager
      .createQueryBuilder()
      .select('c_user.id', 'id')
      .addSelect('c_user.name', 'name')
      .addSelect('c_user.picture', 'picture')
      .addSelect('COUNT(DISTINCT c_subs.subscriber_id)', 'subscribers')
      .addSelect(`EXISTS(${subscribedQuery.getQuery()})`, 'subscribed')
      .from('users', 'c_user')
      .leftJoin('subscriptions', 'c_subs', 'c_subs.publisher_id = c_user.id')
      .groupBy('c_user.id')
      .setParameters(subscribedQuery.getParameters());

    return channelQuery;
  }
}
