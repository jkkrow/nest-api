import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { BadRequestException } from 'src/common/exceptions';
import { UserRepository } from '../../repositories/user.repository';
import { AuthService } from 'src/auth/services/auth.service';
import { EncryptService } from 'src/auth/services/encrypt.service';
import { SigninQuery } from '../impl/signin.query';

@QueryHandler(SigninQuery)
export class SigninHandler implements IQueryHandler<SigninQuery> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly encryptService: EncryptService,
  ) {}

  async execute({ email, password }: SigninQuery) {
    const user = await this.userRepository.findOne({ where: { email } });
    const errorMessage = 'Invalid email or password';

    if (!user || user.type !== 'native') {
      throw new BadRequestException(errorMessage);
    }

    await this.encryptService.verify(password, user.password, errorMessage);

    const credentials = await this.authService.signCredentials(user.id);
    const userWithCredentials = { user, ...credentials };

    return userWithCredentials;
  }
}
