import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetHistoriesQuery } from '../impl/get-histories.query';
import { HistoryRepository } from '../../repositories/history.repository';

@QueryHandler(GetHistoriesQuery)
export class GetHistoriesHandler implements IQueryHandler<GetHistoriesQuery> {
  constructor(private readonly repository: HistoryRepository) {}

  async execute({ userId, skipEnded, params }: GetHistoriesQuery) {
    return {};
  }
}
