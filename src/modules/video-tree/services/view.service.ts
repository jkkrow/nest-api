import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ViewEntity } from '../entities/view.entity';

@Injectable()
export class ViewService {
  constructor(
    @InjectRepository(ViewEntity)
    private readonly repository: Repository<ViewEntity>,
  ) {}

  async add(videoId: string, ip: string, userId?: string) {
    const recentView = await this.repository.findOne({
      where: { videoId, userId, ip },
      order: { createdAt: 'DESC' },
    });

    if (recentView && !this.validateViewedAt(recentView.createdAt)) {
      return;
    }

    return await this.repository
      .createQueryBuilder()
      .insert()
      .values({ videoId, userId, ip })
      .orIgnore()
      .execute();
  }

  private validateViewedAt(viewedAt: Date) {
    const dayAfterViewed = new Date(viewedAt);
    dayAfterViewed.setDate(dayAfterViewed.getDate() + 1);

    const isDayPassed = new Date() > dayAfterViewed;

    return isDayPassed;
  }
}
