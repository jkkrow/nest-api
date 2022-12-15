import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { PageParams } from 'src/common/interfaces/pagination.interface';

@Injectable()
export class HistoryRepository {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async findByUserId(id: string, params: PageParams, skipEnded?: boolean) {
    return {};
  }
}
