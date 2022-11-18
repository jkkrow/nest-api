import { Module } from '@nestjs/common';

import { CloudService } from './services/cloud.service';
import { StorageService } from './services/storage.service';
import { MediaConvertService } from './services/media-convert.service';
import { OAuthService } from './services/oauth.service';

@Module({
  providers: [CloudService, StorageService, MediaConvertService, OAuthService],
  exports: [StorageService, MediaConvertService, OAuthService],
})
export class CloudModule {}
