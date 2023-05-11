import { Expose } from 'class-transformer';

import { VideoTreeStatus } from '../../constants/video-tree.contstant';

export class VideoTreeEntryResponse {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  categories: string[];

  @Expose()
  thumbnail: string;

  @Expose()
  defaultThumbnail: string;

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
