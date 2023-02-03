import { IQuery } from '@nestjs/cqrs';

import { KeysetParams } from 'src/common/interfaces/pagination.interface';

export class GetSubscribersQuery implements IQuery {
  constructor(
    public readonly id: string,
    public readonly params: KeysetParams,
  ) {}
}
