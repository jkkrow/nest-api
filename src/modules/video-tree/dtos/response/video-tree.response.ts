import { Expose, Type } from 'class-transformer';

import { VideoTreeStatus } from '../../constants/video-tree.contstant';

export class VideoTreeRoot {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  url: string;

  @Expose()
  label: string;

  @Expose()
  level: number;

  @Expose()
  size: number;

  @Expose()
  duration: number;

  @Expose()
  selectionTimeStart: number;

  @Expose()
  selectionTimeEnd: number;

  @Expose()
  @Type(() => VideoTreeRoot)
  children: VideoTreeRoot[];
}

export class VideoTreeCategory {
  @Expose()
  name: string;
}

export class VideoTreeResponse {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

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
  @Type(() => VideoTreeRoot)
  root: VideoTreeRoot;
}
