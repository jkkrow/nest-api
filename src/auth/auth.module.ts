import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule as BaseJwtModule } from '@nestjs/jwt';

import { ConfigService } from 'src/config/services/config.service';
import { CacheModule } from 'src/providers/cache/cache.module';
import { JwtService } from './services/jwt.service';
import { EncryptService } from './services/encrypt.service';
import { RoleGuard } from './guards/role.guard';

const GlobalRoleGuard = {
  provide: APP_GUARD,
  useClass: RoleGuard,
};

@Module({
  imports: [
    BaseJwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET_KEY'),
        signOptions: { issuer: config.get('DOMAIN_URL') },
        verifyOptions: { issuer: config.get('DOMAIN_URL') },
      }),
    }),
    CqrsModule,
    CacheModule,
  ],
  providers: [JwtService, EncryptService, GlobalRoleGuard],
  exports: [JwtService, EncryptService],
})
export class AuthModule {}
