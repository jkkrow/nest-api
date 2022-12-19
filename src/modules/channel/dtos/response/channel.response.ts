import { Expose } from 'class-transformer';

export class ChannelResponse {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  picture: string;

  @Expose()
  videos: number;

  @Expose()
  subscribers: number;

  @Expose()
  subscribed: boolean;
}
