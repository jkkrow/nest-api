import { IQuery } from '@nestjs/cqrs';

import { PaginationParams } from 'src/common/interfaces/pagination.interface';

export class GetChannelVideoTreesQuery implements IQuery {
  constructor(
    public readonly channelId: string,
    public readonly params: PaginationParams,
    public readonly userId?: string,
  ) {}
}
