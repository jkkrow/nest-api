import { BadRequestException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { AuthService } from 'src/auth/services/auth.service';
import { SigninQuery } from '../impl/signin.query';
import { UserEntity } from 'src/user/db/entities/user.entity';

@QueryHandler(SigninQuery)
export class SigninHandler implements IQueryHandler<SigninQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  async execute({ email, password }: SigninQuery) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user || user.type !== 'native') {
      throw new BadRequestException('Invalid email or password');
    }

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const { refreshToken, accessToken } = this.authService.signAuthTokens(
      user.id,
    );

    return { user, refreshToken, accessToken };
  }
}
