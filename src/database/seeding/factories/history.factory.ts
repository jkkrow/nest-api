import { define, factory } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';

import { HistoryEntity } from 'src/modules/history/entities/history.entity';
import { VideoTreeEntity } from 'src/modules/video-tree/entities/video-tree.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export interface HistoryContext {
  videoId?: string;
  userId?: string;
  ended?: boolean;
}

define<HistoryEntity, HistoryContext>(HistoryEntity, (_, context?) => {
  const history = new HistoryEntity();

  const video = context?.videoId
    ? { id: context.videoId }
    : (factory(VideoTreeEntity)() as any);
  const user = context?.userId
    ? { id: context.userId }
    : (factory(UserEntity)() as any);

  const ended =
    context?.ended !== undefined ? context.ended : faker.datatype.boolean();

  history.videoId = video.id;
  history.userId = user.id;
  history.video = video;
  history.user = user;
  history.activeNodeId = faker.datatype.uuid();
  history.ended = ended;
  history.progress = faker.datatype.number({ min: 0, max: 0 });
  history.totalProgress = faker.datatype.number({ min: 0, max: 0 });

  return history;
});
