import { Expose, Type } from 'class-transformer';

import { VideoNodeResponse } from 'src/modules/video-tree/dtos/response/video-node.response';

export class GetCreatedVideoNodeResponse {
  @Expose()
  @Type(() => VideoNodeResponse)
  videoNode: VideoNodeResponse;
}
