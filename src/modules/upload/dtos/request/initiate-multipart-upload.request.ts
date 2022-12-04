import { IsString, Matches } from 'class-validator';

export class InitiateMultipartUploadRequest {
  @IsString()
  videoId: string;

  @IsString()
  fileName: string;

  @IsString()
  @Matches(/^video\//, { message: 'Invalid file type' })
  fileType: string;
}
