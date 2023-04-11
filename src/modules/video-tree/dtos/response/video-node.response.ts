import { Expose, Type } from 'class-transformer';

export class VideoNodeResponse {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  url: string;

  @Expose()
  thumbnail: string;

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
  @Type(() => VideoNodeResponse)
  children: VideoNodeResponse[];
}
