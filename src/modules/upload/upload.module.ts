import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AwsModule } from 'src/providers/aws/aws.module';
import { UploadController } from './controllers/upload.controller';

@Module({
  imports: [CqrsModule, AwsModule],
  controllers: [UploadController],
})
export class UploadModule {}
