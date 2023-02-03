import { IQuery } from '@nestjs/cqrs';
import { OffsetParams } from 'src/common/interfaces/pagination.interface';

export class SearchVideoTreesQuery implements IQuery {
  constructor(
    public readonly keyword: string,
    public readonly params: OffsetParams,
    public readonly userId?: string,
  ) {}
}
