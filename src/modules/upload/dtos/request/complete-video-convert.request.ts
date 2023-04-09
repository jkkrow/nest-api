import { IsString } from 'class-validator';
import { Transform, Expose } from 'class-transformer';

export class CompleteVideoConvertRequest {
  @IsString()
  @Expose()
  @Transform(({ obj }) => obj.detail.userMetadata.key)
  key: string;

  @IsString()
  @Expose()
  @Transform(({ obj }) => obj.detail.userMetadata.name)
  name: string;
}
