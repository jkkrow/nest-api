import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CloudModule } from './cloud/cloud.module';
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
    AuthModule,
    UserModule,
    CloudModule,
  ],
  providers: [GlobalValidationPipe, SerializeInterceptor],
})
export class AppModule {}
