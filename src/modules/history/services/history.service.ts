import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HistoryEntity } from '../entities/history.entity';
import { History } from '../interfaces/history.interface';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryEntity)
    private readonly repository: Repository<HistoryEntity>,
  ) {}

  async save(history: History) {
    await this.repository.save(history);
  }

  async delete(videoId: string, userId: string) {
    await this.repository.delete({ videoId, userId });
  }

  async clear(userId: string) {
    await this.repository.delete({ userId });
  }
}
