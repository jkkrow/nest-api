import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from 'src/config/services/config.service';
import { AuthService } from './services/auth.service';
import { RoleGuard } from './guards/role.guard';

const GlobalRoleGuard = {
  provide: APP_GUARD,
  useClass: RoleGuard,
};

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET_KEY'),
        signOptions: {
          issuer: config.get('DOMAIN_URL'),
        },
        verifyOptions: {
          issuer: config.get('DOMAIN_URL'),
        },
      }),
    }),
  ],
  providers: [AuthService, GlobalRoleGuard],
  exports: [AuthService],
})
export class AuthModule {}
