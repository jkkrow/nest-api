import { Module, forwardRef } from '@nestjs/common';

import { AwsModule } from '../aws.module';
import { MediaConvertService } from './services/media-convert.service';

@Module({
  imports: [forwardRef(() => AwsModule)],
  providers: [MediaConvertService],
  exports: [MediaConvertService],
})
export class MediaConvertModule {}
