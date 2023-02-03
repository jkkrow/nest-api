import { IQuery } from '@nestjs/cqrs';
import { KeysetParams } from 'src/common/interfaces/pagination.interface';

export class GetWatchedVideoTreesQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly skipEnded: boolean,
    public readonly params: KeysetParams,
  ) {}
}
