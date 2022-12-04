import { Expose } from 'class-transformer';

export class CompleteMultipartUploadResponse {
  @Expose()
  url: string;
}
