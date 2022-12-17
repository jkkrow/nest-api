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

  private readonly alias = 'channel';

  async findOneById(id: string, userId?: string) {
    return this.getChannelQuery(userId)
      .where(`${this.alias}.id = :id`, { id })
      .getRawOne<Channel>();
  }

  async findByPublisherId(id: string, { page, max }: PageParams) {
    const alias = 'q_subscription';
    const joinCond = `${alias}.subscriber_id = ${this.alias}.id`;

    const query = this.getChannelQuery(id)
      .innerJoin('subscriptions', alias, joinCond)
      .where(`${alias}.publisher_id = :id`, { id })
      .addGroupBy(`${alias}.created_at`)
      .orderBy(`${alias}.created_at`, 'DESC')
      .limit(max)
      .offset(max * (page - 1));

    const [channels, count] = await Promise.all([
      query.getRawMany<Channel>(),
      query.getCount(),
    ]);

    return { channels, count };
  }

  async findBySubscriberId(id: string, { page, max }: PageParams) {
    const alias = 'q_subscription';
    const joinCond = `${alias}.subscriber_id = ${this.alias}.id`;

    const query = this.getChannelQuery(id)
      .innerJoin('subscriptions', alias, joinCond)
      .where(`${alias}.publisher_id = :id`, { id })
      .addGroupBy(`${alias}.created_at`)
      .orderBy(`${alias}.created_at`, 'DESC')
      .limit(max)
      .offset(max * (page - 1));

    const [channels, count] = await Promise.all([
      query.getRawMany<Channel>(),
      query.getCount(),
    ]);

    return { channels, count };
  }

  private getChannelQuery(userId?: string) {
    return this.entityManager
      .createQueryBuilder()
      .select(`${this.alias}.id`, 'id')
      .addSelect(`${this.alias}.name`, 'name')
      .addSelect(`${this.alias}.picture`, 'picture')
      .addSelect('COUNT(DISTINCT subs.subscriber_id)', 'subscribers')
      .addSelect(`EXISTS(${this.getSubscribedQuery()})`, 'subscribed')
      .from('users', this.alias)
      .leftJoin('subscriptions', 'subs', `subs.publisher_id = ${this.alias}.id`)
      .groupBy(`${this.alias}.id`)
      .setParameter('userId', userId);
  }

  private getSubscribedQuery() {
    const alias = 's_subscription';
    const userAlias = 's_user';
    const joinCond = `${userAlias}.id = ${alias}.subscriber_id AND ${alias}.publisher_id = ${this.alias}.id`;

    return this.entityManager
      .createQueryBuilder()
      .select('*')
      .from('subscriptions', alias)
      .innerJoin('users', userAlias, joinCond)
      .where(`${alias}.subscriber_id = :userId`)
      .getQuery();
  }
}
