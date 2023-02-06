import { Expose, Type } from 'class-transformer';

import { KeysetPaginationResponse } from 'src/common/dtos/response/pagination.response';
import { ChannelResponse } from './channel.response';

export class GetSubscribersResponse extends KeysetPaginationResponse {
  @Expose()
  @Type(() => ChannelResponse)
  channels: ChannelResponse[];
}
