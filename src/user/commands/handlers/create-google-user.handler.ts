import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { EncryptService } from 'src/auth/services/encrypt.service';
import { OAuthService } from 'src/cloud/services/oauth.service';
import { CreateGoogleUserCommand } from '../impl/create-google-user.command';
import { UserRepository } from '../../models/user.repository';
import { UserFactory } from '../../models/user.factory';

@CommandHandler(CreateGoogleUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateGoogleUserCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly factory: UserFactory,
    private readonly encryptService: EncryptService,
    private readonly oAuthService: OAuthService,
  ) {}

  async execute({ token }: CreateGoogleUserCommand) {
    const { name, email, picture } = await this.oAuthService.verifyToken(token);

    const existingUser = await this.repository.findByEmail(email);

    if (existingUser && existingUser.type !== 'google') {
      throw new ConflictException('Email already exists');
    }

    if (existingUser && existingUser.type === 'google') {
      return;
    }

    const id = uuidv4();
    const hash = await this.encryptService.hash(uuidv4() + email);

    const user = this.factory.create({
      id,
      type: 'google',
      name,
      email,
      password: hash,
      picture,
      verified: true,
    });

    await this.repository.save(user);

    user.commit();
  }
}
