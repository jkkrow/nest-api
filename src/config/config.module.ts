import { Module, Global } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';

import { ConfigService } from './config.service';
import { validate } from './config.validator';

@Global()
@Module({
  imports: [BaseConfigModule.forRoot({ validate })],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
