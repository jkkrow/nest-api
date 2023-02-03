import { Expose, Type } from 'class-transformer';

import { ChannelResponse } from './channel.response';

export class GetSubscribersResponse {
  @Expose()
  @Type(() => ChannelResponse)
  channels: ChannelResponse[];

  @Expose()
  token: string;
}
