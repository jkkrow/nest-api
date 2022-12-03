import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetSubscribersQuery } from '../impl/get-subscribers.query';
import { ChannelRepository } from '../../repositories/channel.repository';

@QueryHandler(GetSubscribersQuery)
export class GetSubscribersHandler implements IQueryHandler {
  constructor(private readonly repository: ChannelRepository) {}

  async execute({ id, page, max }: GetSubscribersQuery) {
    return await this.repository.findByPublisherId(id, page, max);
  }
}
