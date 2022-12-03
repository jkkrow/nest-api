import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from 'src/providers/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { OAuthModule } from 'src/providers/gcp/oauth/oauth.module';
import { EmailModule } from 'src/providers/email/email.module';
import { BounceModule } from 'src/modules/bounce/bounce.module';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { UserController } from './controllers/user.controller';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handler';
import { EventHandlers } from './events/handlers';
import { UserSaga } from './sagas/user.saga';
import { UserEntity } from './entities/user.entity';
import { MembershipEntity } from './entities/membership.entity';
import { UserFactory } from './models/user.factory';
import { UserRepository } from './models/user.repository';

@Module({
  imports: [
    DatabaseModule.forFeature([UserEntity, MembershipEntity]),
    CqrsModule,
    AuthModule,
    OAuthModule,
    EmailModule,
    BounceModule,
    PaymentModule,
  ],
  controllers: [UserController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    UserSaga,
    UserFactory,
    UserRepository,
  ],
})
export class UserModule {}
