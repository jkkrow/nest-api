import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';

import { NotFoundException } from 'src/common/exceptions';
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
    @InjectRepository(VideoNodeEntity)
    private readonly treeRepository: TreeRepository<VideoNodeEntity>,
    @InjectRepository(VideoTreeEntity)
    readonly repository: Repository<VideoTreeEntity>,
    readonly factory: VideoTreeFactory,
  ) {
    super(repository, factory);
  }

  async findById(id: string) {
    const videoTree = await this.repository.findOneBy({ id });

    if (!videoTree) {
      throw new NotFoundException('VideoTree not found');
    }

    videoTree.root = await this.treeRepository.findDescendantsTree(
      videoTree.root,
    );

    return this.factory.createFromEntity(videoTree);
  }

  async save(videoTree: VideoTree) {
    await this._save(videoTree);
  }

  async delete(videoTree: VideoTree) {
    const videoTreeEntity = this.factory.createEntity(videoTree);
    await this.treeRepository.remove(videoTreeEntity.root);
  }
}
