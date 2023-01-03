import { IsString } from 'class-validator';
import { Transform, Expose } from 'class-transformer';

export class InitiateVideoConvertRequest {
  @IsString()
  @Expose()
  @Transform(({ obj }) => obj.object.key.replace(/\+/g, ' '))
  key: string;

  @IsString()
  @Expose()
  @Transform(({ obj }) => obj.bucket.name)
  bucket: string;
}
