import { Expose, Type } from 'class-transformer';

import { PaginationResponse } from 'src/common/dtos/response/pagination.response';
import { ChannelResponse } from './channel.response';

export class GetSubscribersResponse extends PaginationResponse {
  @Expose()
  @Type(() => ChannelResponse)
  channels: ChannelResponse[];
}
