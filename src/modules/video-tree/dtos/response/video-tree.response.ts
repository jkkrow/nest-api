import { Expose, Type } from 'class-transformer';

import { VideoTreeEntryResponse } from './video-tree-entry.response';
import { VideoNodeResponse } from './video-node.response';

export class VideoTreeResponse extends VideoTreeEntryResponse {
  @Expose()
  description: string;

  @Expose()
  @Type(() => VideoNodeResponse)
  root: VideoNodeResponse;
}
