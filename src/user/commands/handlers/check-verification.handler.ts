import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { AuthService } from 'src/auth/services/auth.service';
import { CheckVerificationCommand } from '../impl/check-verification.comand';
import { UserRepository } from '../../db/repositories/user.repository';

@CommandHandler(CheckVerificationCommand)
export class CheckVerificationHandler
  implements ICommandHandler<CheckVerificationCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute({ token }: CheckVerificationCommand) {
    const { userId } = this.authService.verify(token, { sub: 'verification' });

    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.verified) {
      throw new BadRequestException('Account already has been verified');
    }

    user.updateVerified(true);

    await this.repository.save(user);

    user.commit();
  }
}
