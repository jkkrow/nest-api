import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { APP_GUARD } from '@nestjs/core';

import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { UserMiddleware } from './middlewares/user.middleware';
import { RoleGuard } from './guards/role.guard';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handler';
import { EventHandlers } from './events/handlers';
import { UserSaga } from './sagas/user.saga';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { PremiumEntity } from './entities/premium.entity';

const GlobalRoleGuard = {
  provide: APP_GUARD,
  useClass: RoleGuard,
};

@Module({
  imports: [
    CqrsModule,
    DatabaseModule.forFeature([UserEntity, PremiumEntity]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    UserSaga,
    UserRepository,
    GlobalRoleGuard,
  ],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
