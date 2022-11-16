import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateUserCommand } from '../impl/create-user.command';
import { UserRepository } from '../../db/repositories/user.repository';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly repository: UserRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute({ name, email, password }: CreateUserCommand) {
    const isExisting = await this.repository.findByEmail(email);

    if (isExisting) {
      throw new ConflictException('Email already exists.');
    }

    const user = this.publisher.mergeObjectContext(
      await this.repository.createUser(uuidv4(), name, email, password),
    );

    user.commit();
  }
}
