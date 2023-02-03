import { IQuery } from '@nestjs/cqrs';

import { KeysetParams } from 'src/common/interfaces/pagination.interface';

export class GetVideoTreesQuery implements IQuery {
  constructor(
    public readonly options: { ids?: string[] },
    public readonly params: KeysetParams,
    public readonly userId?: string,
  ) {}
}
