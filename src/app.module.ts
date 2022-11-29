import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { BounceModule } from './bounce/bounce.module';
import { AwsModule } from './providers/aws/aws.module';
import { GcpModule } from './providers/gcp/gcp.module';
import { EmailModule } from './providers/email/email.module';
import { SerializeInterceptor } from './common/interceptors/serialize.interceptor';

const GlobalValidationPipe = {
  provide: APP_PIPE,
  useValue: new ValidationPipe({ transform: true, whitelist: true }),
};

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    DatabaseModule,
    CacheModule,
    AuthModule,
    UserModule,
    ChannelModule,
    BounceModule,
    AwsModule,
    GcpModule,
    EmailModule,
  ],
  providers: [GlobalValidationPipe, SerializeInterceptor],
})
export class AppModule {}
