import { Expose, Type } from 'class-transformer';

import { VideoTreeStatus } from '../../constants/video-tree.contstant';

class VideoTreeCategory {
  @Expose()
  name: string;
}

export class VideoTreeEntryResponse {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  @Type(() => VideoTreeCategory)
  categories: VideoTreeCategory[];

  @Expose()
  thumbnail: string;

  @Expose()
  size: number;

  @Expose()
  maxDuration: number;

  @Expose()
  minDuration: number;

  @Expose()
  status: VideoTreeStatus;

  @Expose()
  editing: boolean;

  @Expose()
  creatorId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
