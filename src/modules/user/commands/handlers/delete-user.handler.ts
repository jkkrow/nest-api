import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { EncryptService } from 'src/auth/services/encrypt.service';
import { DeleteUserCommand } from '../impl/delete-user.command';
import { UserRepository } from '../../models/user.repository';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly repository: UserRepository,
    private readonly encryptService: EncryptService,
  ) {}

  async execute({ id, email, password }: DeleteUserCommand) {
    const user = await this.repository.findById(id);
    const errorMessage = 'Invalid email or password';

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (email !== user.email) {
      throw new BadRequestException(errorMessage);
    }

    await this.encryptService.verify(password, user.password, errorMessage);

    user.delete();

    await this.repository.delete(user);

    user.commit();
  }
}
