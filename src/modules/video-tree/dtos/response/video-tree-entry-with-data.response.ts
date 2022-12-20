import { Expose, Type } from 'class-transformer';

import { VideoTreeEntryResponse } from './video-tree-entry.response';

class VideoTreeCreator {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  picture: string;
}

class VideoTreeHistory {
  @Expose()
  activeNodeId: string;

  @Expose()
  progress: number;

  @Expose()
  totalProgress: number;

  @Expose()
  ended: boolean;
}

export class VideoTreeEntryWithDataResponse extends VideoTreeEntryResponse {
  @Expose()
  @Type(() => VideoTreeCreator)
  creator: VideoTreeCreator;

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
