import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FavoriteEntity } from '../entities/favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly repository: Repository<FavoriteEntity>,
  ) {}

  add(videoId: string, userId: string) {
    return this.repository
      .createQueryBuilder()
      .insert()
      .values({ videoId, userId })
      .orIgnore()
      .execute();
  }

  remove(videoId: string, userId: string) {
    return this.repository
      .createQueryBuilder()
      .delete()
      .where('video_id = :videoId', { videoId })
      .andWhere('user_id = :userId', { userId })
      .execute();
  }
}
