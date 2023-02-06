import { Expose, Type } from 'class-transformer';

import { KeysetPaginationResponse } from 'src/common/dtos/response/pagination.response';
import { VideoTreeEntryWithDataResponse } from './video-tree-entry-with-data.response';

export class GetWatchedVideoTreesResponse extends KeysetPaginationResponse {
  @Expose()
  @Type(() => VideoTreeEntryWithDataResponse)
  videoTrees: VideoTreeEntryWithDataResponse[];
}
