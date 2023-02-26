import { IQuery } from '@nestjs/cqrs';
import { PaginationParams } from 'src/common/interfaces/pagination.interface';

export class SearchVideoTreesQuery implements IQuery {
  constructor(
    public readonly keyword: string,
    public readonly params: PaginationParams,
    public readonly userId?: string,
  ) {}
}
