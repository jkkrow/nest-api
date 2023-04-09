import { IsString } from 'class-validator';
import { Transform, Expose } from 'class-transformer';

export class InitiateVideoConvertRequest {
  @IsString()
  @Expose()
  @Transform(({ obj }) => obj.detail.object.key.replace(/\+/g, ' '))
  key: string;

  @IsString()
  @Expose()
  @Transform(({ obj }) => obj.detail.bucket.name)
  bucket: string;
}
