import { IQuery } from '@nestjs/cqrs';

import { PageParams } from 'src/common/interfaces/pagination.interface';

export class GetHistoriesQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly params: PageParams,
    public readonly skipEnded?: boolean,
  ) {}
}
