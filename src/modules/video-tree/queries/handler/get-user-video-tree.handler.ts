import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetUserVideoTreeQuery } from '../impl/get-user-video-tree.query';

@QueryHandler(GetUserVideoTreeQuery)
export class GetUserVideoTreeHandler
  implements IQueryHandler<GetUserVideoTreeQuery>
{
  async execute({ id, userId }: GetUserVideoTreeQuery) {
    return {};
  }
}
