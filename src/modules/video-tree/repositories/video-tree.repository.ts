import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';

import { BaseRepository } from 'src/providers/database/repositories/database.repository';
import { FindOptions } from 'src/providers/database/types/database.type';
import {
  VideoTree,
  VideoTreeWithData,
  VideoTreeOnlyRoot,
  VideoTreeOnlyRootWithData,
} from '../interfaces/video-tree';
import { VideoTreeEntity } from '../entities/video-tree.entity';
import { VideoNodeEntity } from '../entities/video-node.entity';

interface FindVideoTreeOptions
  extends FindOptions<VideoTreeEntity, 'histories' | 'favorites' | 'views'> {}

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
    super('video_trees');
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
    // Alias
    const video = this.alias;
    const root = 'v_root';
    const category = 'v_categories';

    return this.repository
      .createQueryBuilder(video)
      .leftJoinAndSelect(`${video}.root`, root)
      .leftJoinAndSelect(`${video}.categories`, category);
  }

  private getVideoTreeWithDataQuery(userId?: string) {
    // Alias
    const video = this.alias;
    const view = 'v_views';
    const favorite = 'v_favorites';
    const history = 'v_histories';
    const category = 'v_categories';
    const root = 'v_root';
    const creator = 'v_creator';

    // Join Condition
    const joinView = `${view}.video_id = ${video}.id`;
    const joinFavorite = `${favorite}.video_id = ${video}.id`;
    const joinHistory = `${history}.video_id = ${video}.id AND ${history}.user_id = :userId`;

    return this.repository
      .createQueryBuilder(video)
      .addSelect(`COUNT(DISTINCT ${view}.id)`, 'views')
      .addSelect(`COUNT(DISTINCT ${favorite}.user_id)`, 'favorites')
      .addSelect(`EXISTS(${this.getFavoritedQuery()})`, 'favorited')
      .leftJoin('views', view, joinView)
      .leftJoin('favorites', favorite, joinFavorite)
      .leftJoinAndSelect(`${video}.root`, root)
      .leftJoinAndSelect(`${video}.categories`, category)
      .leftJoinAndSelect(`${video}.creator`, creator)
      .leftJoinAndMapOne(`${video}.history`, 'histories', history, joinHistory)
      .addGroupBy(`${video}.id`)
      .addGroupBy(`${root}.id`)
      .addGroupBy(`${creator}.id`)
      .addGroupBy(`${history}.video_id`)
      .addGroupBy(`${history}.user_id`)
      .addGroupBy(`${category}.name`)
      .setParameter('userId', userId);
  }

  private getFavoritedQuery() {
    // Alias
    const video = this.alias;
    const favorite = 'f_favorites';
    const user = 'f_user';

    // Join Condition
    const joinUser = `${user}.id = ${favorite}.user_id AND ${favorite}.video_id = ${video}.id`;

    return this.repository
      .createQueryBuilder()
      .select('*')
      .from('favorites', favorite)
      .innerJoin('users', user, joinUser)
      .where(`${favorite}.user_id = :userId`)
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
