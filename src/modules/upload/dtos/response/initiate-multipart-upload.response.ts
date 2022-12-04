import { Expose } from 'class-transformer';

export class InitiateMultipartUploadResponse {
  @Expose()
  uploadId: string;
}
