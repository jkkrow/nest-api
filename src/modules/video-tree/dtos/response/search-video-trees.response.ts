import { Expose, Type } from 'class-transformer';

import { VideoTreeEntryWithDataResponse } from './video-tree-entry-with-data.response';

export class SearchVideoTreesResponse {
  @Expose()
  @Type(() => VideoTreeEntryWithDataResponse)
  videoTrees: VideoTreeEntryWithDataResponse[];

  @Expose()
  count: number;
}
