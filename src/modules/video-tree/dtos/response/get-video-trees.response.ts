import { Expose, Type } from 'class-transformer';

import { VideoTreeWithDataResponse } from './video-tree-with-data.response';

export class GetVideoTreesResponse {
  @Expose()
  @Type(() => VideoTreeWithDataResponse)
  videoTrees: VideoTreeWithDataResponse[];

  @Expose()
  count: number;
}
