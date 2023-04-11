import { Module } from '@nestjs/common';

import { MediaConvertService } from './services/media-convert.service';

@Module({
  providers: [MediaConvertService],
  exports: [MediaConvertService],
})
export class MediaConvertModule {}
