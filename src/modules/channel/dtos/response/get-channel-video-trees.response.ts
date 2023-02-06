import { Expose, Type } from 'class-transformer';

import { OffsetPaginationResponse } from 'src/common/dtos/response/pagination.response';
import { VideoTreeEntryResponse } from 'src/modules/video-tree/dtos/response/video-tree-entry.response';

export class GetChannelVideoTreesResponse extends OffsetPaginationResponse {
  @Expose()
  @Type(() => VideoTreeEntryResponse)
  videoTrees: VideoTreeEntryResponse[];
}
