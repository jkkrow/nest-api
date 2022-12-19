import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetSubscribesQuery } from '../impl/get-subscribes.query';
import { ChannelRepository } from '../../repositories/channel.repository';

@QueryHandler(GetSubscribesQuery)
export class GetSubscribesHandler implements IQueryHandler {
  constructor(private readonly repository: ChannelRepository) {}

  async execute({ id, params }: GetSubscribesQuery) {
    return this.repository.find(
      {
        relation: {
          table: 'subscriptions',
          condition: { 'subscriptions.publisher_id': 'id' },
        },
        where: { 'subscriptions.subscriber_id': id },
        orderBy: { 'subscriptions.created_at': 'DESC' },
        pagination: params,
      },
      id,
    );
  }
}
