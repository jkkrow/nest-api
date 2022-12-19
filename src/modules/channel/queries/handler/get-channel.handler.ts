import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { NotFoundException } from 'src/common/exceptions';
import { GetChannelQuery } from '../impl/get-channel.query';
import { ChannelRepository } from '../../repositories/channel.repository';

@QueryHandler(GetChannelQuery)
export class GetChannelHandler implements IQueryHandler {
  constructor(private readonly repository: ChannelRepository) {}

  async execute({ id, userId }: GetChannelQuery) {
    const channel = await this.repository.findOne({ where: { id } }, userId);

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    return channel;
  }
}
