import { Expose } from 'class-transformer';

export class ProcessMultipartUploadResponse {
  @Expose()
  presignedUrls: string[];
}
