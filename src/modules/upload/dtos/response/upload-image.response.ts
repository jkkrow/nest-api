import { Expose } from 'class-transformer';

export class UploadImageResponse {
  @Expose()
  presignedUrl: string;

  @Expose()
  key: string;
}
