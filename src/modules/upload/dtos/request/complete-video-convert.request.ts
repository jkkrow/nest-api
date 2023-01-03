import { IsString } from 'class-validator';
import { Transform, Expose } from 'class-transformer';

export class CompleteVideoConvertRequest {
  @IsString()
  @Expose()
  @Transform(({ obj }) => obj.bucket.detail.userMetadata.key)
  key: string;

  @IsString()
  @Expose()
  @Transform(({ obj }) => obj.bucket.detail.userMetadata.userId)
  userId: string;

  @IsString()
  @Expose()
  @Transform(({ obj }) => obj.bucket.detail.userMetadata.videoId)
  videoId: string;

  @IsString()
  @Expose()
  @Transform(({ obj }) => obj.bucket.detail.userMetadata.name)
  name: string;
}
