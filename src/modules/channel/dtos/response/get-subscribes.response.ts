import { Expose, Type } from 'class-transformer';

import { OffsetPaginationResponse } from 'src/common/dtos/response/pagination.response';
import { ChannelResponse } from './channel.response';

export class GetSubscribesResponse extends OffsetPaginationResponse {
  @Expose()
  @Type(() => ChannelResponse)
  channels: ChannelResponse[];
}
