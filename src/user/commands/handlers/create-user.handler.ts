import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { CreateUserCommand } from '../impl/create-user.command';
import { UserRepository } from '../../db/repositories/user.repository';
import { UserFactory } from '../../db/factories/user.factory';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly repository: UserRepository,
    private readonly factory: UserFactory,
  ) {}

  async execute({ name, email, password }: CreateUserCommand) {
    const existingUser = await this.repository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const id = uuidv4();
    const hash = bcrypt.hashSync(password, 12);

    const user = this.factory.create({
      id,
      type: 'native',
      name,
      email,
      password: hash,
    });

    await this.repository.save(user);

    user.create();
    user.commit();
  }
}
