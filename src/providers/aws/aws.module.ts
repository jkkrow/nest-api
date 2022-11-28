import { Module } from '@nestjs/common';

import { S3Module } from './s3/s3.module';
import { MediaConvertModule } from './media-convert/media-convert.module';

@Module({
  imports: [S3Module, MediaConvertModule],
  exports: [S3Module, MediaConvertModule],
})
export class AwsModule {}
