import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { CloudModule } from 'src/cloud/cloud.module';
import { EmailModule } from 'src/email/email.module';
import { UserController } from './controllers/user.controller';
import { UserMiddleware } from './middlewares/user.middleware';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handler';
import { EventHandlers } from './events/handlers';
import { UserSaga } from './sagas/user.saga';
import { UserEntity } from './db/entities/user.entity';
import { SubscriptionEntity } from './db/entities/subscription.entity';
import { UserRepository } from './db/repositories/user.repository';
import { UserFactory } from './db/factories/user.factory';

@Module({
  imports: [
    CqrsModule,
    DatabaseModule.forFeature([UserEntity, SubscriptionEntity]),
    AuthModule,
    CloudModule,
    EmailModule,
  ],
  controllers: [UserController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    UserSaga,
    UserRepository,
    UserFactory,
  ],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
