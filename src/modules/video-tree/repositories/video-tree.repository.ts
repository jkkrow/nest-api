import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';

import { BaseRepository } from 'src/providers/database/repositories/database.repository';
import { FindOptions } from 'src/providers/database/types/database.type';
import {
  VideoTree,
  VideoTreeWithData,
  VideoTreeNoRoot,
  VideoTreeNoRootWithData,
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
    return this.getMany<VideoTreeNoRoot>(query, options);
  }

  async findWithData(options: FindVideoTreeOptions, userId?: string) {
    const query = this.getVideoTreeWithDataQuery(userId);
    return this.getMany<VideoTreeNoRootWithData>(query, options);
  }

  async findOne(options: FindVideoTreeOptions) {
    const query = this.getVideoTreeQuery(true);
    const videoTree = await this.getOne<VideoTreeOnlyRoot>(query, options);

    return videoTree ? this.withAllNodes(videoTree) : null;
  }

  async findOneWithData(options: FindVideoTreeOptions, userId?: string) {
    const query = this.getVideoTreeWithDataQuery(userId, true);
    const videoTree = await this.getOne<VideoTreeOnlyRootWithData>(
      query,
      options,
    );

    return videoTree ? this.withAllNodes<VideoTreeWithData>(videoTree) : null;
  }

  async findOneNode(options: FindVideoTreeOptions, nodeId: string) {
    const query = this.getVideoTreeQuery(true);
    const videoTree = await this.getOne<VideoTreeOnlyRoot>(query, options);
    const videoTreeNode = videoTree ? await this.withAllNodes(videoTree) : null;
    const nodes = videoTreeNode ? this.traverseNodes(videoTreeNode.root) : [];

    return nodes.find((node) => node.id === nodeId);
  }

  private getVideoTreeQuery(withRoot?: boolean) {
    const video = this.alias;
    const category = 'v_categories';
    const categoryGroup = 'v_categories_video_trees';
    const root = 'v_root';

    const joinCategoryGroup = `${video}.id = ${categoryGroup}.video_tree_id`;
    const joinCategory = `${category}.name = ${categoryGroup}.category_name`;

    const query = this.repository
      .createQueryBuilder(video)
      .addSelect(
        `ARRAY_REMOVE(ARRAY_REMOVE(ARRAY_AGG(${category}.name), ''), NULL)`,
        'categories',
      )
      .leftJoin('categories_video_trees', categoryGroup, joinCategoryGroup)
      .leftJoin('categories', category, joinCategory)
      .addGroupBy(`${video}.id`);

    if (withRoot) {
      query.leftJoinAndSelect(`${video}.root`, root);
      query.addGroupBy(`${root}.id`);
    }

    return query;
  }

  private getVideoTreeWithDataQuery(userId?: string, withRoot?: boolean) {
    const video = this.alias;
    const view = 'v_views';
    const favorite = 'v_favorites';
    const history = 'v_histories';
    const creator = 'v_creator';

    const joinView = `${view}.video_id = ${video}.id`;
    const joinFavorite = `${favorite}.video_id = ${video}.id`;
    const joinHistory = `${history}.video_id = ${video}.id AND ${history}.user_id = :userId`;
    const joinCreator = `${video}.creator_id = ${creator}.id`;

    const query = this.getVideoTreeQuery(withRoot)
      .addSelect(`COUNT(DISTINCT ${view}.id)`, 'views')
      .addSelect(`COUNT(DISTINCT ${favorite}.user_id)`, 'favorites')
      .addSelect(`EXISTS(${this.getFavoritedQuery()})`, 'favorited')
      .addSelect(`${creator}.id`, 'creator.id')
      .addSelect(`${creator}.name`, 'creator.name')
      .addSelect(`${creator}.picture`, 'creator.picture')
      .leftJoin('views', view, joinView)
      .leftJoin('favorites', favorite, joinFavorite)
      .leftJoin(`${video}.creator`, creator, joinCreator)
      .leftJoinAndMapOne(`${video}.history`, 'histories', history, joinHistory)
      .addGroupBy(`${creator}.id`)
      .addGroupBy(`${history}.video_id`)
      .addGroupBy(`${history}.user_id`)
      .setParameter('userId', userId);

    return query;
  }

  private getFavoritedQuery() {
    const video = this.alias;
    const favorite = 'f_favorites';
    const user = 'f_user';

    const joinUser = `${user}.id = ${favorite}.user_id AND ${favorite}.video_id = ${video}.id`;

    return this.repository
      .createQueryBuilder()
      .select('*')
      .from('favorites', favorite)
      .innerJoin('users', user, joinUser)
      .where(`${favorite}.user_id = :userId`)
      .getQuery();
  }

  private async withAllNodes<T extends VideoTree>(
    videoTree: VideoTreeOnlyRoot,
  ) {
    videoTree.root = await this.treeRepository.findDescendantsTree(
      videoTree.root as VideoNodeEntity,
    );

    return videoTree as T;
  }

  private traverseNodes<T extends VideoTree['root']>(root: T) {
    let currentNode = root;
    const queue: T[] = [];
    const nodes: T[] = [];

    while (currentNode) {
      nodes.push(currentNode);

      if (currentNode.children.length) {
        currentNode.children.forEach((child: T) => queue.push(child));
      }

      currentNode = queue.shift() as T;
    }

    return nodes;
  }
}
