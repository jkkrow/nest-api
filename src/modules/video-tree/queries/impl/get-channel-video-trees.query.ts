import { IQuery } from '@nestjs/cqrs';

import { PageParams } from 'src/common/interfaces/pagination.interface';

export class GetChannelVideoTreesQuery implements IQuery {
  constructor(
    public readonly channelId: string,
    public readonly params: PageParams,
    public readonly userId?: string,
  ) {}
}
