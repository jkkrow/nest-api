import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { BadRequestException } from 'src/common/exceptions';
import { UserRepository } from '../../repositories/user.repository';
import { JwtService } from 'src/auth/services/jwt.service';
import { EncryptService } from 'src/auth/services/encrypt.service';
import { SigninQuery } from '../impl/signin.query';

@QueryHandler(SigninQuery)
export class SigninHandler implements IQueryHandler<SigninQuery> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly encryptService: EncryptService,
  ) {}

  async execute({ email, password }: SigninQuery) {
    const user = await this.userRepository.findOne({ where: { email } });
    const errorMessage = 'Invalid email or password';

    if (!user || user.type !== 'native') {
      throw new BadRequestException(errorMessage);
    }

    await this.encryptService.verify(password, user.password, errorMessage);

    const session = this.jwtService.createSession(user.id);
    const userWithSession = { user, ...session };

    return userWithSession;
  }
}
