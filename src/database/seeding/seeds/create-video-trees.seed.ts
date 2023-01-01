import { Seeder, Factory } from 'typeorm-seeding';

import { VideoTreeEntity } from 'src/modules/video-tree/entities/video-tree.entity';
import { VideoTreeContext } from '../factories/video-tree.factory';

export default class CreateVideoTrees implements Seeder {
  async run(factory: Factory) {
    await factory<VideoTreeEntity, VideoTreeContext>(VideoTreeEntity)({
      maxLevel: 2,
    }).createMany(5);
  }
}
