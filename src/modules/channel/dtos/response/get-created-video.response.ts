import { Expose, Type } from 'class-transformer';

import { VideoTreeResponse } from 'src/modules/video-tree/dtos/response/video-tree.response';

export class GetCreatedVideoTreeResponse {
  @Expose()
  @Type(() => VideoTreeResponse)
  videoTree: VideoTreeResponse;
}
