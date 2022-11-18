import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { OAuthService } from 'src/cloud/services/oauth.service';
import { CreateGoogleUserCommand } from '../impl/create-google-user.command';
import { UserRepository } from '../../db/repositories/user.repository';

@CommandHandler(CreateGoogleUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateGoogleUserCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly oAuthService: OAuthService,
    private readonly publisher: EventPublisher,
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
    const hash = bcrypt.hashSync(uuidv4() + email, 12);

    const user = this.publisher.mergeObjectContext(
      await this.repository.createUser({
        id,
        type: 'google',
        name,
        email,
        password: hash,
        picture,
        verified: true,
      }),
    );

    user.create();
    user.commit();
  }
}
