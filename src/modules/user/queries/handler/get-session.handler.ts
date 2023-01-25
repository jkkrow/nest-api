import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { JwtService } from 'src/auth/services/jwt.service';
import { GetSessionQuery } from '../impl/get-session.query';

@QueryHandler(GetSessionQuery)
export class GetSessionHandler implements IQueryHandler<GetSessionQuery> {
  constructor(private readonly jwtService: JwtService) {}

  async execute({ refreshToken }: GetSessionQuery) {
    const session = await this.jwtService.rotateRefreshToken(refreshToken);
    return session;
  }
}
