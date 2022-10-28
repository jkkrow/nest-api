import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';

import { CreateUserCommand } from '../impl/create-user.command';
import { UserRepository } from '../../repositories/user.repository';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly repository: UserRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateUserCommand) {
    Logger.log(
      'CreateUserCommand',
      JSON.stringify(command.createUserDto, null, 2),
    );

    const { createUserDto } = command;
    const user = this.publisher.mergeObjectContext(
      this.repository.createUser(createUserDto.name),
    );

    user.commit();

    return user;
  }
}
