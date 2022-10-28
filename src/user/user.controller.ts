import { Controller, Post, HttpCode, Body, Get, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateUserCommand } from './commands/impl/create-user.command';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(body));
  }
}
