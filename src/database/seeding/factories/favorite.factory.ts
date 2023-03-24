import { define, factory } from 'typeorm-seeding';

import { FavoriteEntity } from 'src/modules/video-tree/entities/favorite.entity';
import { VideoTreeEntity } from 'src/modules/video-tree/entities/video-tree.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export interface FavoriteContext {
  videoId?: string;
  userId?: string;
}

define<FavoriteEntity, FavoriteContext>(FavoriteEntity, (_, context?) => {
  const favorite = new FavoriteEntity();

  const video = context?.videoId
    ? { id: context.videoId }
    : (factory(VideoTreeEntity)() as any);
  const user = context?.userId
    ? { id: context.userId }
    : (factory(UserEntity)() as any);

  favorite.videoId = video.id;
  favorite.userId = user.id;
  favorite.video = video;
  favorite.user = user;

  return favorite;
});
