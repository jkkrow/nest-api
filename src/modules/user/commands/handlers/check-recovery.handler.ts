import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { JwtService } from 'src/auth/services/jwt.service';
import { CheckRecoveryCommand } from '../impl/check-recovery.command';
import { UserRepository } from '../../models/user.repository';

@CommandHandler(CheckRecoveryCommand)
export class CheckRecoveryHandler
  implements ICommandHandler<CheckRecoveryCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({ token }: CheckRecoveryCommand) {
    const { userId } = this.jwtService.verify(token, { sub: 'recovery' });

    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found for this token');
    }
  }
}
