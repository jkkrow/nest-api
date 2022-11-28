import { Module, forwardRef } from '@nestjs/common';

import { AwsModule } from '../aws.module';
import { S3Service } from './s3.service';

@Module({
  imports: [forwardRef(() => AwsModule)],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
