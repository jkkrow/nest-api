import { define, factory } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';

import { VideoTreeEntity } from 'src/modules/video-tree/entities/video-tree.entity';
import { VideoNodeEntity } from 'src/modules/video-tree/entities/video-node.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export interface VideoTreeContext {
  maxLevel?: number;
}

define<VideoTreeEntity, VideoTreeContext>(VideoTreeEntity, (_, context) => {
  const videoTree = new VideoTreeEntity();

  videoTree.id = faker.datatype.uuid();
  videoTree.title = faker.lorem.word({ length: { max: 10, min: 3 } });
  videoTree.thumbnail = faker.image.imageUrl();
  videoTree.description = faker.lorem.paragraph();
  videoTree.size = faker.datatype.number({ min: 100 });
  videoTree.maxDuration = faker.datatype.number({ min: 100 });
  videoTree.minDuration = faker.datatype.number({ max: videoTree.maxDuration });
  videoTree.editing = false;
  videoTree.status = 'public';
  videoTree.categories = faker.lorem
    .words(Math.floor(Math.random() * 5))
    .split(' ')
    .map((category) => ({ name: category }));

  videoTree.creator = factory(UserEntity)() as any;
  videoTree.root = factory(VideoNodeEntity)(context) as any;

  return videoTree;
});
