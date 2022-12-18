import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';

import {
  BaseRepository,
  FindOptions,
} from 'src/providers/database/repositories/database.repository';
import {
  VideoTree,
  VideoTreeWithData,
  VideoTreeOnlyRoot,
  VideoTreeOnlyRootWithData,
} from '../interfaces/video-tree';
import { VideoTreeEntity } from '../entities/video-tree.entity';
import { VideoNodeEntity } from '../entities/video-node.entity';

interface FindVideoTreeOptions
  extends FindOptions<VideoTreeEntity, 'history' | 'favorite' | 'view'> {}

@Injectable()
export class VideoTreeRepository extends BaseRepository<
  VideoTreeEntity,
  FindVideoTreeOptions
> {
  constructor(
    @InjectRepository(VideoTreeEntity)
    private readonly repository: Repository<VideoTreeEntity>,
    @InjectRepository(VideoNodeEntity)
    private readonly treeRepository: TreeRepository<VideoNodeEntity>,
  ) {
    super('video_tree');
  }

  async find(options: FindVideoTreeOptions) {
    const query = this.getVideoTreeQuery();
    const findQuery = this.filterQuery(query, options);

    const [videoTrees, count] = await Promise.all([
      findQuery.getMapMany<VideoTreeOnlyRoot>(),
      findQuery.getCount(),
    ]);

    return { videoTrees, count };
  }

  async findOne(options: FindVideoTreeOptions) {
    const query = this.getVideoTreeQuery();
    const findQuery = this.filterQuery(query, options);

    const videoTree = await findQuery.getMapOne<VideoTreeOnlyRoot>();
    return videoTree ? this.withFullNodes(videoTree) : null;
  }

  async findWithData(options: FindVideoTreeOptions, userId?: string) {
    const query = this.getVideoTreeWithDataQuery(userId);
    const findQuery = this.filterQuery(query, options);

    const [videoTrees, count] = await Promise.all([
      findQuery.getMapMany<VideoTreeOnlyRootWithData>(),
      findQuery.getCount(),
    ]);

    return { videoTrees, count };
  }

  async findOneWithData(options: FindVideoTreeOptions, userId?: string) {
    const query = this.getVideoTreeWithDataQuery(userId);
    const findQuery = this.filterQuery(query, options);

    const videoTree = await findQuery.getMapOne<VideoTreeOnlyRoot>();
    return videoTree ? this.withFullNodes<VideoTreeWithData>(videoTree) : null;
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
      .leftJoinAndSelect(`${this.alias}.root`, 'root')
      .leftJoinAndSelect(`${this.alias}.categories`, 'category')
      .leftJoinAndSelect(`${this.alias}.creator`, 'creator')
      .leftJoinAndMapOne(
        `${this.alias}.history`,
        'histories',
        'history',
        `history.video_id = ${this.alias}.id AND history.user_id = :userId`,
      )
      .groupBy(`${this.alias}.id`)
      .addGroupBy('root.id')
      .addGroupBy('creator.id')
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
