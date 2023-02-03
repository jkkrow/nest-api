import { IQuery } from '@nestjs/cqrs';

import { OffsetParams } from 'src/common/interfaces/pagination.interface';

export class GetChannelVideoTreesQuery implements IQuery {
  constructor(
    public readonly channelId: string,
    public readonly params: OffsetParams,
    public readonly userId?: string,
  ) {}
}
