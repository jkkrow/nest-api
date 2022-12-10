import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetCurrentChannelVideoTreeQuery } from '../impl/get-current-channel-video-tree.query';

@QueryHandler(GetCurrentChannelVideoTreeQuery)
export class GetCurrentChannelVideoTreeHandler
  implements IQueryHandler<GetCurrentChannelVideoTreeQuery>
{
  async execute({ id, userId }: GetCurrentChannelVideoTreeQuery) {
    return {};
  }
}
