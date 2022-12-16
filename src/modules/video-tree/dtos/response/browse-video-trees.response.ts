import { Expose, Type } from 'class-transformer';

import { VideoTreeWithDataResponse } from './video-tree-with-data.response';

export class BrowseVideoTreesResponse {
  @Expose()
  @Type(() => VideoTreeWithDataResponse)
  videoTrees: VideoTreeWithDataResponse[];

  @Expose()
  count: number;
}
