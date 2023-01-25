import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { NotFoundException } from 'src/common/exceptions';
import { JwtService } from 'src/auth/services/jwt.service';
import { GetSessionQuery } from '../impl/get-session.query';
import { UserRepository } from '../../repositories/user.repository';

@QueryHandler(GetSessionQuery)
export class GetSessionHandler implements IQueryHandler<GetSessionQuery> {
  constructor(
    private readonly repository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({ refreshToken }: GetSessionQuery) {
    const { userId, ...rest } = await this.jwtService.rotateRefreshToken(
      refreshToken,
    );

    const user = await this.repository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const session = { user, ...rest };

    return session;
  }
}
