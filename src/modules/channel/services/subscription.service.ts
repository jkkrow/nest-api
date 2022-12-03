import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubscriptionEntity } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly repository: Repository<SubscriptionEntity>,
  ) {}

  subscribe(publisherId: string, subscriberId: string) {
    return this.repository
      .createQueryBuilder()
      .insert()
      .values({ publisherId, subscriberId, createdAt: new Date() })
      .orIgnore()
      .execute();
  }

  unsubscribe(publisherId: string, subscriberId: string) {
    return this.repository
      .createQueryBuilder()
      .delete()
      .where('publisher_id = :publisherId', { publisherId })
      .andWhere('subscriber_id = :subscriberId', { subscriberId })
      .execute();
  }
}
