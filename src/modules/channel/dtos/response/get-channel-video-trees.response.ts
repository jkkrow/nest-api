import { Expose, Type } from 'class-transformer';

import { PaginationResponse } from 'src/common/dtos/response/pagination.response';
import { VideoTreeEntryWithDataResponse } from 'src/modules/video-tree/dtos/response/video-tree-entry-with-data.response';

export class GetChannelVideoTreesResponse extends PaginationResponse {
  @Expose()
  @Type(() => VideoTreeEntryWithDataResponse)
  items: VideoTreeEntryWithDataResponse[];
}
