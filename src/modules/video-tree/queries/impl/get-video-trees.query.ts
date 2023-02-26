import { IQuery } from '@nestjs/cqrs';

import { PaginationParams } from 'src/common/interfaces/pagination.interface';

export class GetVideoTreesQuery implements IQuery {
  constructor(
    public readonly options: { ids?: string[] },
    public readonly params: PaginationParams,
    public readonly userId?: string,
  ) {}
}
