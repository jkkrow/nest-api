import { EventPublisher } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { BaseFactory } from 'src/providers/database/models/database.factory';
import { VideoTreeEntity } from '../entities/video-tree.entity';
import { VideoTree } from './video-tree';

@Injectable()
export class VideoTreeFactory
  implements BaseFactory<VideoTreeEntity, VideoTree>
{
  constructor(private readonly publisher: EventPublisher) {}

  create(params: { id: string; creatorId: string }) {
    const videoTree = this.publisher.mergeObjectContext(
      new VideoTree({
        ...params,
        title: 'Untitled',
        categories: [],
        description: '',
        thumbnail: '',
        defaultThumbnail: '',
        size: 0,
        maxDuration: 0,
        minDuration: 0,
        status: 'public',
        editing: true,
        root: {
          id: uuidv4(),
          level: 0,
          name: '',
          url: '',
          thumbnail: '',
          label: '',
          size: 0,
          duration: 0,
          selectionTimeStart: 0,
          selectionTimeEnd: 0,
          children: [],
        },
      }),
    );

    videoTree.create();

    return videoTree;
  }

  createEntity(model: VideoTree): VideoTreeEntity {
    return {
      id: model.id,
      creatorId: model.creatorId,
      title: model.title,
      categories: model.categories.map((category) => ({ name: category })),
      description: model.description,
      thumbnail: model.thumbnail,
      defaultThumbnail: model.defaultThumbnail,
      size: model.size,
      maxDuration: model.maxDuration,
      minDuration: model.minDuration,
      status: model.status,
      editing: model.editing,
      root: model.root,
    } as VideoTreeEntity;
  }

  createFromEntity(entity: VideoTreeEntity): VideoTree {
    const videoTree = new VideoTree({
      id: entity.id,
      creatorId: entity.creatorId,
      title: entity.title,
      categories: entity.categories.map((category) => category.name),
      description: entity.description,
      thumbnail: entity.thumbnail,
      defaultThumbnail: entity.defaultThumbnail,
      size: entity.size,
      maxDuration: entity.maxDuration,
      minDuration: entity.minDuration,
      status: entity.status,
      editing: entity.editing,
      root: entity.root,
    });

    return this.publisher.mergeObjectContext(videoTree);
  }
}
