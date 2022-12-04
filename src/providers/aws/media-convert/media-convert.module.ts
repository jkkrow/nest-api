import { Module, forwardRef } from '@nestjs/common';

import { AwsModule } from '../aws.module';
import { MediaConvertService } from './services/meida-convert.service';

@Module({
  imports: [forwardRef(() => AwsModule)],
  providers: [MediaConvertService],
  exports: [MediaConvertService],
})
export class MediaConvertModule {}
