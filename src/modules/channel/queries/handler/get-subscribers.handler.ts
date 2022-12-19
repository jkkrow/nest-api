import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetSubscribersQuery } from '../impl/get-subscribers.query';
import { ChannelRepository } from '../../repositories/channel.repository';

@QueryHandler(GetSubscribersQuery)
export class GetSubscribersHandler implements IQueryHandler {
  constructor(private readonly repository: ChannelRepository) {}

  async execute({ id, params }: GetSubscribersQuery) {
    return this.repository.find(
      {
        relation: {
          table: 'subscriptions',
          condition: { 'subscriptions.subscriber_id': 'id' },
        },
        where: { 'subscriptions.publisher_id': id },
        orderBy: { 'subscriptions.created_at': 'DESC' },
        pagination: params,
      },
      id,
    );
  }
}
