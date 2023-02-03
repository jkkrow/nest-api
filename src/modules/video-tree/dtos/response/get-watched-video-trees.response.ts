import { Expose, Type } from 'class-transformer';

import { VideoTreeEntryWithDataResponse } from './video-tree-entry-with-data.response';

export class GetWatchedVideoTreesResponse {
  @Expose()
  @Type(() => VideoTreeEntryWithDataResponse)
  videoTrees: VideoTreeEntryWithDataResponse[];

  @Expose()
  token: string;
}
