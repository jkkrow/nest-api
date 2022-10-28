import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from 'src/database/database.module';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserSaga } from './sagas/user.saga';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handler';
import { EventHandlers } from './events/handlers';
import { UserSchema, UserSchemaClass } from './schemas/user.schema';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaClass },
    ]),
    CqrsModule,
  ],
  controllers: [UserController],
  providers: [
    UserRepository,
    UserSaga,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class UserModule {}
