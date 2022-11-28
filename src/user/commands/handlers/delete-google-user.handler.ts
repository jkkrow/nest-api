import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { OAuthService } from 'src/cloud/services/oauth.service';
import { DeleteGoogleUserCommand } from '../impl/delete-google-user.command';
import { UserRepository } from '../../models/user.repository';

@CommandHandler(DeleteGoogleUserCommand)
export class DeleteGoogleUserHandler
  implements ICommandHandler<DeleteGoogleUserCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly oAuthService: OAuthService,
  ) {}

  async execute({ id, token }: DeleteGoogleUserCommand) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { email } = await this.oAuthService.verifyToken(token);

    if (email !== user.email) {
      throw new BadRequestException('Invalid token');
    }

    user.delete();

    await this.repository.save(user);

    user.commit();
  }
}
