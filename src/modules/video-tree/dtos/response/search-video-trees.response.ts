import { Expose, Type } from 'class-transformer';

import { OffsetPaginationResponse } from 'src/common/dtos/response/pagination.response';
import { VideoTreeEntryWithDataResponse } from './video-tree-entry-with-data.response';

export class SearchVideoTreesResponse extends OffsetPaginationResponse {
  @Expose()
  @Type(() => VideoTreeEntryWithDataResponse)
  videoTrees: VideoTreeEntryWithDataResponse[];
}
