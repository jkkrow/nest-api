import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { NotFoundException } from 'src/common/exceptions';
import { EncryptService } from 'src/auth/services/encrypt.service';
import { UpdatePasswordCommand } from '../impl/update-password.command';
import { UserRepository } from '../../models/user.repository';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler
  implements ICommandHandler<UpdatePasswordCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly encryptService: EncryptService,
  ) {}

  async execute({ id, password, newPassword }: UpdatePasswordCommand) {
    const user = await this.repository.findById(id);
    const errorMessage = 'Invalid email or password';

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.encryptService.verify(password, user.password, errorMessage);
    const hash = await this.encryptService.hash(newPassword);

    user.updatePassword(hash);

    await this.repository.save(user);

    user.commit();
  }
}
