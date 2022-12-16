import { Expose, Type } from 'class-transformer';

import { VideoTreeResponse } from 'src/modules/video-tree/dtos/response/video-tree.response';

export class GetCreatedVideoTreesResponse {
  @Expose()
  @Type(() => VideoTreeResponse)
  videoTrees: VideoTreeResponse[];

  @Expose()
  count: number;
}
