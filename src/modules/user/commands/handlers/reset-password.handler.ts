import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { NotFoundException } from 'src/common/exceptions';
import { JwtService } from 'src/auth/services/jwt.service';
import { EncryptService } from 'src/auth/services/encrypt.service';
import { ResetPasswordCommand } from '../impl/reset-password.command';
import { UserRepository } from '../../models/user.repository';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly encryptService: EncryptService,
  ) {}

  async execute({ token, password }: ResetPasswordCommand) {
    const { userId } = this.jwtService.verify(token, { sub: 'recovery' });

    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found for this token');
    }

    const hash = await this.encryptService.hash(password);

    user.updatePassword(hash);

    await this.repository.save(user);

    user.commit();
  }
}
