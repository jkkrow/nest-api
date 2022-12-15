import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';

import { PageParams } from 'src/common/interfaces/pagination.interface';
import {
  VideoTreeWithData,
  VideoTreeOnlyRootWithData,
} from '../interfaces/video-tree';
import { VideoTreeEntity } from '../entities/video-tree.entity';
import { VideoNodeEntity } from '../entities/video-node.entity';

@Injectable()
export class VideoTreeRepository {
  constructor(
    @InjectRepository(VideoTreeEntity)
    private readonly repository: Repository<VideoTreeEntity>,
    @InjectRepository(VideoNodeEntity)
    private readonly treeRepository: TreeRepository<VideoNodeEntity>,
  ) {}

  async findWithData({ page, max }: PageParams, userId?: string) {
    const query = this.getVideoTreeWithDataQuery(userId)
      .orderBy('video_tree.created_at', 'DESC')
      .limit(max)
      .offset(max * (page - 1));

    const [videoTrees, count] = await Promise.all([
      query.getMapMany<VideoTreeOnlyRootWithData>(),
      query.getCount(),
    ]);

    return { videoTrees, count };
  }

  async findOneWithDataById(id: string, userId?: string) {
    const videoTree = await this.getVideoTreeWithDataQuery(userId)
      .where('video_tree.id = :id', { id })
      .getMapOne<VideoTreeOnlyRootWithData>();

    if (!videoTree) {
      return null;
    }

    videoTree.root = await this.treeRepository.findDescendantsTree(
      videoTree.root as VideoNodeEntity,
    );

    return videoTree as VideoTreeWithData;
  }

  private getVideoTreeWithDataQuery(userId?: string) {
    const favoritedQuery = this.repository
      .createQueryBuilder()
      .select('*')
      .from('favorites', 'f_favor')
      .innerJoin(
        'users',
        'f_user',
        'f_user.id = f_favor.user_id AND f_favor.video_id = video_tree.id',
      )
      .where('f_favor.user_id = :userId', { userId });

    const videoTreeWithDataQuery = this.repository
      .createQueryBuilder('video_tree')
      .addSelect('COUNT(DISTINCT view.id)', 'views')
      .addSelect('COUNT(DISTINCT favorite.user_id)', 'favorites')
      .addSelect(`EXISTS(${favoritedQuery.getQuery()})`, 'favorited')
      .leftJoinAndSelect('video_tree.root', 'video_node')
      .leftJoinAndSelect('video_tree.categories', 'category')
      .leftJoinAndSelect('video_tree.user', 'user')
      .leftJoin('views', 'view', 'view.video_id = video_tree.id')
      .leftJoin('favorites', 'favorite', 'favorite.video_id = video_tree.id')
      .leftJoinAndMapOne(
        'video_tree.history',
        'histories',
        'history',
        'history.video_id = video_tree.id AND history.user_id = :userId',
        { userId },
      )
      .groupBy('video_tree.id')
      .addGroupBy('video_node.id')
      .addGroupBy('user.id')
      .addGroupBy('history.video_id')
      .addGroupBy('history.user_id')
      .addGroupBy('category.name');

    return videoTreeWithDataQuery;
  }
}
