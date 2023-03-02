import { Expose, Type } from 'class-transformer';

import { PaginationResponse } from 'src/common/dtos/response/pagination.response';
import { VideoTreeEntryResponse } from 'src/modules/video-tree/dtos/response/video-tree-entry.response';

export class GetChannelVideoTreesResponse extends PaginationResponse {
  @Expose()
  @Type(() => VideoTreeEntryResponse)
  items: VideoTreeEntryResponse[];
}
