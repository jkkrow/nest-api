import { Expose, Type } from 'class-transformer';

import { VideoTreeEntryResponse } from 'src/modules/video-tree/dtos/response/video-tree-entry.response';

export class GetCreatedVideoTreesResponse {
  @Expose()
  @Type(() => VideoTreeEntryResponse)
  videoTrees: VideoTreeEntryResponse[];

  @Expose()
  count: number;
}
