import { Expose, Type } from 'class-transformer';

import { ChannelResponse } from './channel.response';

export class GetChannelResponse {
  @Expose()
  @Type(() => ChannelResponse)
  channel: ChannelResponse;
}
