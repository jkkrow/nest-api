import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AwsModule } from 'src/providers/aws/aws.module';
import { UploadController } from './controllers/upload.controller';
import { UploadService } from './services/upload.service';

@Module({
  imports: [CqrsModule, AwsModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
