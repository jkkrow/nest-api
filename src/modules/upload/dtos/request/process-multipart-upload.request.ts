import { IsString, IsInt } from 'class-validator';

export class ProcessMultipartUploadRequest {
  @IsString()
  videoId: string;

  @IsString()
  fileName: string;

  @IsInt()
  partCount: number;
}
