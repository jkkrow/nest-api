import { IsString } from 'class-validator';

export class CancelMultipartUploadRequest {
  @IsString()
  videoId: string;

  @IsString()
  fileName: string;
}
