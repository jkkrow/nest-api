import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from 'src/providers/database/repositories/database.repository';
import { FindOptions } from 'src/providers/database/types/database.type';
import { ChannelEntity } from '../entities/channel.entity';
import { Channel } from '../interfaces/channel.interface';

interface FindChannelOptions
  extends FindOptions<ChannelEntity, 'subscriptions'> {}

@Injectable()
export class ChannelRepository extends BaseRepository<
  ChannelEntity,
  FindChannelOptions
> {
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly repository: Repository<ChannelEntity>,
  ) {
    super('channels');
  }

  async find(options: FindChannelOptions, userId?: string) {
    const query = this.getChannelQuery(userId);
    return this.getMany<Channel>(query, options);
  }

  async findOne(options: FindChannelOptions, userId?: string) {
    const query = this.getChannelQuery(userId);
    return this.getOne<Channel>(query, options);
  }

  private getChannelQuery(userId?: string) {
    return this.repository
      .createQueryBuilder(this.alias)
      .addSelect(`EXISTS(${this.getSubscribedQuery()})`, 'subscribed')
      .setParameter('userId', userId);
  }

  private getSubscribedQuery() {
    // Alias
    const channel = this.alias;
    const subscription = 's_subscriptions';
    const user = 's_users';

    // Join Condition
    const joinUser = `${user}.id = ${subscription}.subscriber_id AND ${subscription}.publisher_id = ${channel}.id`;

    return this.repository
      .createQueryBuilder()
      .select('*')
      .from('subscriptions', subscription)
      .innerJoin('users', user, joinUser)
      .where(`${subscription}.subscriber_id = :userId`)
      .getQuery();
  }
}
