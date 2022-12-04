import { Module } from '@nestjs/common';

import { S3Module } from 'src/providers/aws/s3/s3.module';
import { UploadController } from './controllers/upload.controller';

@Module({
  imports: [S3Module],
  controllers: [UploadController],
})
export class UploadModule {}
