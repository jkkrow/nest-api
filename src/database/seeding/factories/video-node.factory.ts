import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';

import { VideoNodeEntity } from 'src/modules/video-tree/entities/video-node.entity';

export interface VideoNodeContext {
  maxLevel?: number;
}

define<VideoNodeEntity, VideoNodeContext>(VideoNodeEntity, (_, context) => {
  const videoNode = generateVideoNode();

  if (context && context.maxLevel) {
    buildDescendants(videoNode, context.maxLevel);
  }

  return videoNode;
});

function generateVideoNode(level = 0) {
  const videoNode = new VideoNodeEntity();

  videoNode.id = faker.datatype.uuid();
  videoNode.level = level;
  videoNode.name = faker.lorem.word({ length: { max: 10, min: 2 } });
  videoNode.label = faker.lorem.word({ length: { max: 10, min: 2 } });
  videoNode.url = faker.image.imageUrl();
  videoNode.size = faker.datatype.number({ min: 100 });
  videoNode.duration = faker.datatype.number({ min: 10 });
  videoNode.selectionTimeEnd = faker.datatype.number({
    min: 0,
    max: videoNode.duration,
  });
  videoNode.selectionTimeStart = faker.datatype.number({
    min: 0,
    max: videoNode.selectionTimeEnd,
  });
  videoNode.children = [];

  return videoNode;
}

function buildDescendants(node: VideoNodeEntity, maxLevel: number) {
  let currentNode = node;
  const queue = [currentNode];
  const childCount = Math.floor(Math.random() * 4);

  while (queue.length) {
    currentNode = queue.shift() as VideoNodeEntity;
    if (currentNode.level + 1 > maxLevel) continue;

    for (let count = 0; count <= childCount; count++) {
      const childNode = generateVideoNode(currentNode.level + 1);
      currentNode.children.push(childNode);
      queue.push(childNode);
    }
  }
}
