import { IsString, IsOptional, Matches } from 'class-validator';

export class UploadImageRequest {
  @IsOptional()
  @IsString()
  key?: string;

  @IsString()
  @Matches(/^image\//, { message: 'Invalid file type' })
  fileType: string;
}
