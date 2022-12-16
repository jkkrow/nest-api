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
    readonly repository: Repository<VideoTreeEntity>,
    readonly factory: VideoTreeFactory,
    @InjectRepository(VideoNodeEntity)
    private readonly treeRepository: TreeRepository<VideoNodeEntity>,
  ) {
    super(repository, factory);
  }

  async findOneById(id: string) {
    const videoTree = await this.repository.findOneBy({ id });

    if (!videoTree) {
      return null;
    }

    const node = await this.treeRepository.findDescendantsTree(videoTree.root);
    videoTree.root = node;

    return this.factory.createFromEntity(videoTree);
  }

  async save(videoTree: VideoTree) {
    await this._save(videoTree);
  }

  async delete(videoTree: VideoTree) {
    await this._delete(videoTree);
  }
}
