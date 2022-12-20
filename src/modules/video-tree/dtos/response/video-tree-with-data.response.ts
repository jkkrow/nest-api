import { Expose, Type } from 'class-transformer';

import { VideoNodeResponse } from './video-node.response';
import { VideoTreeEntryWithDataResponse } from './video-tree-entry-with-data.response';

export class VideoTreeWithDataResponse extends VideoTreeEntryWithDataResponse {
  @Expose()
  description: string;

  @Expose()
  @Type(() => VideoNodeResponse)
  root: VideoNodeResponse;
}
