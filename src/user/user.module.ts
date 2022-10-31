import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { UserMiddleware } from './middlewares/user.middleware';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handler';
import { EventHandlers } from './events/handlers';
import { UserSaga } from './sagas/user.saga';
import { UserRepository } from './repositories/user.repository';
import { UserFactory } from './user.factory';
import { UserSchema, UserSchemaClass } from './schemas/user.schema';
import { UserSchemaFactory } from './schemas/user-schema.factory';

@Module({
  imports: [
    CqrsModule,
    DatabaseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaClass },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    UserSaga,
    UserRepository,
    UserFactory,
    UserSchemaFactory,
  ],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
