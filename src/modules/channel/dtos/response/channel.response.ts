import { Expose } from 'class-transformer';

import { IChannel } from '../../interfaces/channel.interface';

export class ChannelResponse implements IChannel {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  picture: string;

  @Expose()
  subscribers: number;

  @Expose()
  subscribed: boolean;
}
