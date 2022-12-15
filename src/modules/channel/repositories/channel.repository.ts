import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { PageParams } from 'src/common/interfaces/pagination.interface';
import { Channel } from '../interfaces/channel.interface';

@Injectable()
export class ChannelRepository {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async findOneById(id: string, userId?: string) {
    return this.getChannelQuery(userId)
      .where('user.id = :id', { id })
      .getRawOne<Channel>();
  }

  async findByPublisherId(id: string, { page, max }: PageParams) {
    const query = this.getChannelQuery(id)
      .innerJoin('subscriptions', 'q_subs', 'q_subs.subscriber_id = user.id')
      .where('q_subs.publisher_id = :id', { id })
      .addGroupBy('q_subs.created_at')
      .orderBy('q_subs.created_at', 'DESC')
      .limit(max)
      .offset(max * (page - 1));

    const [channels, count] = await Promise.all([
      query.getRawMany<Channel>(),
      query.getCount(),
    ]);

    return { channels, count };
  }

  async findBySubscriberId(id: string, { page, max }: PageParams) {
    const query = this.getChannelQuery(id)
      .innerJoin('subscriptions', 'q_subs', 'q_subs.publisher_id = user.id')
      .where('q_subs.subscriber_id = :id', { id })
      .addGroupBy('q_subs.created_at')
      .orderBy('q_subs.created_at', 'DESC')
      .limit(max)
      .offset(max * (page - 1));

    const [channels, count] = await Promise.all([
      query.getRawMany<Channel>(),
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
        's_user.id = s_subs.subscriber_id AND s_subs.publisher_id = user.id',
      )
      .where('s_subs.subscriber_id = :userId', { userId });

    const channelQuery = this.entityManager
      .createQueryBuilder()
      .select('user.id', 'id')
      .addSelect('user.name', 'name')
      .addSelect('user.picture', 'picture')
      .addSelect('COUNT(DISTINCT subs.subscriber_id)', 'subscribers')
      .addSelect(`EXISTS(${subscribedQuery.getQuery()})`, 'subscribed')
      .from('users', 'user')
      .leftJoin('subscriptions', 'subs', 'subs.publisher_id = user.id')
      .groupBy('user.id')
      .setParameters(subscribedQuery.getParameters());

    return channelQuery;
  }
}
