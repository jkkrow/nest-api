import { Expose, Type } from 'class-transformer';

import { PaginationResponse } from 'src/common/dtos/response/pagination.response';
import { VideoTreeEntryWithDataResponse } from './video-tree-entry-with-data.response';

export class GetVideoTreesResponse extends PaginationResponse {
  @Expose()
  @Type(() => VideoTreeEntryWithDataResponse)
  items: VideoTreeEntryWithDataResponse[];
}
