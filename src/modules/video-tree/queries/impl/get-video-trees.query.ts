import { IQuery } from '@nestjs/cqrs';

import { PageParams } from 'src/common/interfaces/pagination.interface';

export class GetVideoTreesQuery implements IQuery {
  constructor(
    public readonly params: PageParams,
    public readonly userId?: string,
  ) {}
}
