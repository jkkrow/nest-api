import { IQuery } from '@nestjs/cqrs';

import { PageParams } from 'src/common/interfaces/pagination.interface';

export class GetCreatedVideoTreesQuery implements IQuery {
  constructor(
    public readonly creatorId: string,
    public readonly params: PageParams,
  ) {}
}
