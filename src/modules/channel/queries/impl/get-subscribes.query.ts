import { IQuery } from '@nestjs/cqrs';

import { PaginationParams } from 'src/common/interfaces/pagination.interface';

export class GetSubscribesQuery implements IQuery {
  constructor(
    public readonly id: string,
    public readonly params: PaginationParams,
  ) {}
}
