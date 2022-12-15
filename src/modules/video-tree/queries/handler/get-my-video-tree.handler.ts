import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetMyVideoTreeQuery } from '../impl/get-my-video-tree.query';

@QueryHandler(GetMyVideoTreeQuery)
export class GetMyVideoTreeHandler
  implements IQueryHandler<GetMyVideoTreeQuery>
{
  async execute({ id, userId }: GetMyVideoTreeQuery) {
    return {};
  }
}
