import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { JwtService } from 'src/auth/services/jwt.service';
import { SignoutQuery } from '../impl/signout.query';

@QueryHandler(SignoutQuery)
export class SignoutHandler implements IQueryHandler<SignoutQuery> {
  constructor(private readonly jwtService: JwtService) {}

  async execute({ refreshToken }: SignoutQuery) {
    const { exp } = this.jwtService.verify(refreshToken);
    return this.jwtService.invalidateRefreshToken(refreshToken, null, exp);
  }
}
