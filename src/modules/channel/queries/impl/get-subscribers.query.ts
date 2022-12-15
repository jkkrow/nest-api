import { IQuery } from '@nestjs/cqrs';

import { PageParams } from 'src/common/interfaces/pagination.interface';

export class GetSubscribersQuery implements IQuery {
  constructor(public readonly id: string, public readonly params: PageParams) {}
}
