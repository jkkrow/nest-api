import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { JWTService } from 'src/auth/services/jwt.service';
import { GetAuthTokenQuery } from '../impl/get-auth-token.query';

@QueryHandler(GetAuthTokenQuery)
export class GetAuthTokenHandler implements IQueryHandler<GetAuthTokenQuery> {
  constructor(private readonly jwtService: JWTService) {}

  async execute({ refreshToken }: GetAuthTokenQuery) {
    const token = await this.jwtService.rotateRefreshToken(refreshToken);

    return token;
  }
}
