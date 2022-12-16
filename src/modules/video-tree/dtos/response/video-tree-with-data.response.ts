import { Expose, Type } from 'class-transformer';

import { VideoTreeResponse } from './video-tree.response';

export class VideoTreeUser {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  picture: string;
}

export class VideoTreeHistory {
  @Expose()
  activeNodeId: string;

  @Expose()
  progress: number;

  @Expose()
  totalProgress: number;

  @Expose()
  ended: boolean;
}

export class VideoTreeWithDataResponse extends VideoTreeResponse {
  @Expose()
  @Type(() => VideoTreeUser)
  creator: VideoTreeUser;

  @Expose()
  views: number;

  @Expose()
  favorites: number;

  @Expose()
  favorited: boolean;

  @Expose()
  @Type(() => VideoTreeHistory)
  history: VideoTreeHistory | null;
}
