import { Module } from '@nestjs/common';

import { CloudService } from './services/cloud.service';
import { StorageService } from './services/storage.service';
import { MediaConvertService } from './services/media-convert.service';

@Module({
  providers: [CloudService, StorageService, MediaConvertService],
  exports: [StorageService, MediaConvertService],
})
export class CloudModule {}
