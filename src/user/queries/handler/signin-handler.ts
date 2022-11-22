import { BadRequestException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JWTService } from 'src/auth/services/jwt.service';
import { EncryptService } from 'src/auth/services/encrypt.service';
import { SigninQuery } from '../impl/signin.query';
import { UserEntity } from '../../db/entities/user.entity';

@QueryHandler(SigninQuery)
export class SigninHandler implements IQueryHandler<SigninQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JWTService,
    private readonly encryptService: EncryptService,
  ) {}

  async execute({ email, password }: SigninQuery) {
    const user = await this.userRepository.findOneBy({ email });
    const errorMessage = 'Invalid email or password';

    if (!user || user.type !== 'native') {
      throw new BadRequestException(errorMessage);
    }

    await this.encryptService.verify(password, user.password, errorMessage);

    const { refreshToken, accessToken } = this.jwtService.signAuthToken(
      user.id,
    );

    return { user, refreshToken, accessToken };
  }
}
