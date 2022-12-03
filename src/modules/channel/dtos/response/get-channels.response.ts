import { Expose, Type } from 'class-transformer';

import { ChannelResponse } from './channel.response';

export class GetChannelsResponse {
  @Expose()
  @Type(() => ChannelResponse)
  channels: ChannelResponse[];

  @Expose()
  count: number;
}
