import { Expose, Type } from 'class-transformer';

import { VideoTreeWithDataResponse } from './video-tree-with-data.response';

export class WatchVideoTreeResponse {
  @Expose()
  @Type(() => VideoTreeWithDataResponse)
  videoTree: VideoTreeWithDataResponse;
}
