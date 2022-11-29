import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { OAuthModule } from 'src/providers/gcp/oauth/oauth.module';
import { EmailModule } from 'src/providers/email/email.module';
import { BounceModule } from 'src/bounce/bounce.module';
import { UserController } from './controllers/user.controller';
import { RoleGuard } from '../auth/guards/role.guard';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handler';
import { EventHandlers } from './events/handlers';
import { UserSaga } from './sagas/user.saga';
import { UserEntity } from './entities/user.entity';
import { MembershipEntity } from './entities/membership.entity';
import { UserFactory } from './models/user.factory';
import { UserRepository } from './models/user.repository';

const GlobalRoleGuard = {
  provide: APP_GUARD,
  useClass: RoleGuard,
};

@Module({
  imports: [
    CqrsModule,
    DatabaseModule.forFeature([UserEntity, MembershipEntity]),
    AuthModule,
    OAuthModule,
    EmailModule,
    BounceModule,
  ],
  controllers: [UserController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    UserSaga,
    UserFactory,
    UserRepository,
    GlobalRoleGuard,
  ],
})
export class UserModule {}
