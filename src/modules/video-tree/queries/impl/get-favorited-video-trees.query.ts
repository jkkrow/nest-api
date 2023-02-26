import { IQuery } from '@nestjs/cqrs';
import { PaginationParams } from 'src/common/interfaces/pagination.interface';

export class GetFavoritedVideoTreesQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly params: PaginationParams,
  ) {}
}
