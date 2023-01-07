import { Module } from '@nestjs/common';

import { OAuthService } from './services/oauth.service';

@Module({
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule {}
