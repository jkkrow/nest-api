import { IQuery } from '@nestjs/cqrs';
import { PageParams } from 'src/common/interfaces/pagination.interface';

export class GetWatchedVideoTreesQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly skipEnded: boolean,
    public readonly params: PageParams,
  ) {}
}
