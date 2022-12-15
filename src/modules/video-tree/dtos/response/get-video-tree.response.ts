import { Expose, Type } from 'class-transformer';

import { VideoTreeWithDataResponse } from './video-tree-with-data.response';

export class GetVideoTreeResponse {
  @Expose()
  @Type(() => VideoTreeWithDataResponse)
  videoTree: VideoTreeWithDataResponse;
}
