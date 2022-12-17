import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';

import { BaseRepository } from 'src/providers/database/models/database.repository';
import { VideoNodeEntity } from '../entities/video-node.entity';
import { VideoTreeEntity } from '../entities/video-tree.entity';
import { VideoTree } from './video-tree';
import { VideoTreeFactory } from './video-tree.factory';

@Injectable()
export class VideoTreeRepository extends BaseRepository<
  VideoTreeEntity,
  VideoTree
> {
  constructor(
    @InjectRepository(VideoTreeEntity)
    protected readonly repository: Repository<VideoTreeEntity>,
    @InjectRepository(VideoNodeEntity)
    protected readonly treeRepository: TreeRepository<VideoNodeEntity>,
    protected readonly factory: VideoTreeFactory,
  ) {
    super(repository, factory);
  }

  async findOneById(id: string) {
    const videoTree = await this._findOne({ id });
    return videoTree ? this.withFullNodes(videoTree) : null;
  }

  async save(videoTree: VideoTree) {
    await this._save(videoTree);
  }

  async delete(videoTree: VideoTree) {
    await this._delete(videoTree);
  }

  private async withFullNodes(videoTree: VideoTree) {
    const entity = this.factory.createEntity(videoTree);
    entity.root = await this.treeRepository.findDescendantsTree(entity.root);
    return this.factory.createFromEntity(entity);
  }
}
