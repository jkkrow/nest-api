import { Module } from '@nestjs/common';
import { ConfigModule as DefaultConfigModule } from '@nestjs/config';

import { validate } from './config.validator';

@Module({
  imports: [
    DefaultConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
  ],
})
export class ConfigModule {}
