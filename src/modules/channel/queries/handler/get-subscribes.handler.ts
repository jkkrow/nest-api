import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetSubscribesQuery } from '../impl/get-subscribes.query';
import { ChannelRepository } from '../../repositories/channel.repository';

@QueryHandler(GetSubscribesQuery)
export class GetSubscribesHandler implements IQueryHandler {
  constructor(private readonly repository: ChannelRepository) {}

  async execute({ id, params }: GetSubscribesQuery) {
    return await this.repository.findBySubscriberId(id, params);
  }
}
