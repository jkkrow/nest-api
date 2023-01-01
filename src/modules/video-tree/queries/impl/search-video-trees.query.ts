import { IQuery } from '@nestjs/cqrs';
import { PageParams } from 'src/common/interfaces/pagination.interface';

export class SearchVideoTreesQuery implements IQuery {
  constructor(
    public readonly keyword: string,
    public readonly params: PageParams,
    public readonly userId?: string,
  ) {}
}
