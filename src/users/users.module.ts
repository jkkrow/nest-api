import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { UsersController } from './controllers/users.controller';
import { UserRepository } from './repository/user.repository';
import { UsersSagas } from './sagas/users.saga';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handler';
import { EventHandlers } from './events/handlers';

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [
    UserRepository,
    UsersSagas,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class UsersModule {}
