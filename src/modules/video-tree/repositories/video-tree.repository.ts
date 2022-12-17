import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, TreeRepository } from 'typeorm';

import { PageParams } from 'src/common/interfaces/pagination.interface';
import {
  VideoTree,
  VideoTreeWithData,
  VideoTreeOnlyRoot,
  VideoTreeOnlyRootWithData,
} from '../interfaces/video-tree';
import { VideoTreeEntity } from '../entities/video-tree.entity';
import { VideoNodeEntity } from '../entities/video-node.entity';
import { VideoTreeStatus } from '../constants/video-tree.contstant';

interface FindVideoTreeOptions {
  id?: string;
  creatorId?: string;
  status?: VideoTreeStatus;
}

@Injectable()
export class VideoTreeRepository {
  constructor(
    @InjectRepository(VideoTreeEntity)
    private readonly repository: Repository<VideoTreeEntity>,
    @InjectRepository(VideoNodeEntity)
    private readonly treeRepository: TreeRepository<VideoNodeEntity>,
  ) {}

  private readonly alias = 'video_tree';

  async find(options: FindVideoTreeOptions, params: PageParams) {
    const query = this.getVideoTreeQuery();
    const findQuery = this.findVideoTreeQuery(query, options, params);

    const [videoTrees, count] = await Promise.all([
      findQuery.getMapMany<VideoTreeOnlyRoot>(),
      findQuery.getCount(),
    ]);

    return { videoTrees, count };
  }

  async findOne(options: FindVideoTreeOptions) {
    const query = this.getVideoTreeQuery();
    const findQuery = this.findVideoTreeQuery(query, options);

    const videoTree = await findQuery.getMapOne<VideoTreeOnlyRoot>();
    return videoTree ? this.withFullNodes(videoTree) : null;
  }

  async findWithData(
    options: FindVideoTreeOptions,
    params: PageParams,
    userId?: string,
  ) {
    const query = this.getVideoTreeWithDataQuery(userId);
    const findQuery = this.findVideoTreeQuery(query, options, params);

    const [videoTrees, count] = await Promise.all([
      findQuery.getMapMany<VideoTreeOnlyRootWithData>(),
      findQuery.getCount(),
    ]);

    return { videoTrees, count };
  }

  async findOneWithData(options: FindVideoTreeOptions, userId?: string) {
    const query = this.getVideoTreeWithDataQuery(userId);
    const findQuery = this.findVideoTreeQuery(query, options);

    const videoTree = await findQuery.getMapOne<VideoTreeOnlyRootWithData>();
    return videoTree ? this.withFullNodes<VideoTreeWithData>(videoTree) : null;
  }

  private findVideoTreeQuery(
    query: SelectQueryBuilder<VideoTreeEntity>,
    options: FindVideoTreeOptions,
    params?: PageParams,
  ) {
    const { id, creatorId, status } = options;

    if (id) {
      query.andWhere(`${this.alias}.id = :id`, { id });
    }

    if (creatorId) {
      query.andWhere(`${this.alias}.creator_id = :creatorId`, { creatorId });
    }

    if (status) {
      query.andWhere(`${this.alias}.status = :status`, { status });
    }

    if (params) {
      query.orderBy(`${this.alias}.created_at`, 'DESC');
      query.limit(params.max);
      query.offset(params.max * (params.page - 1));
    }

    return query;
  }

  private getVideoTreeQuery() {
    return this.repository
      .createQueryBuilder(this.alias)
      .leftJoinAndSelect(`${this.alias}.root`, 'node')
      .leftJoinAndSelect(`${this.alias}.categories`, 'category');
  }

  private getVideoTreeWithDataQuery(userId?: string) {
    return this.repository
      .createQueryBuilder(this.alias)
      .addSelect('COUNT(DISTINCT view.id)', 'views')
      .addSelect('COUNT(DISTINCT favorite.user_id)', 'favorites')
      .addSelect(`EXISTS(${this.getFavoritedQuery()})`, 'favorited')
      .leftJoin('views', 'view', `view.video_id = ${this.alias}.id`)
      .leftJoin('favorites', 'favorite', `favorite.video_id = ${this.alias}.id`)
      .leftJoinAndSelect(`${this.alias}.root`, 'node')
      .leftJoinAndSelect(`${this.alias}.categories`, 'category')
      .leftJoinAndSelect(`${this.alias}.creator`, 'user')
      .leftJoinAndMapOne(
        `${this.alias}.history`,
        'histories',
        'history',
        `history.video_id = ${this.alias}.id AND history.user_id = :userId`,
      )
      .groupBy(`${this.alias}.id`)
      .addGroupBy('node.id')
      .addGroupBy('user.id')
      .addGroupBy('history.video_id')
      .addGroupBy('history.user_id')
      .addGroupBy('category.name')
      .setParameter('userId', userId);
  }

  private getFavoritedQuery() {
    const alias = 'f_favor';
    const userAlias = 'f_user';
    const joinCond = `${userAlias}.id = ${alias}.user_id AND ${alias}.video_id = ${this.alias}.id`;

    return this.repository
      .createQueryBuilder()
      .select('*')
      .from('favorites', alias)
      .innerJoin('users', userAlias, joinCond)
      .where(`${alias}.user_id = :userId`)
      .getQuery();
  }

  private async withFullNodes<T extends VideoTree>(
    videoTree: VideoTreeOnlyRoot,
  ) {
    videoTree.root = await this.treeRepository.findDescendantsTree(
      videoTree.root as VideoNodeEntity,
    );

    return videoTree as T;
  }
}
