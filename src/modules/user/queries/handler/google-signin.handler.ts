import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { NotFoundException } from 'src/common/exceptions';
import { UserRepository } from '../../repositories/user.repository';
import { JwtService } from 'src/auth/services/jwt.service';
import { OAuthService } from 'src/providers/gcp/oauth/oauth.service';
import { GoogleSigninQuery } from '../impl/google-signin.query';

@QueryHandler(GoogleSigninQuery)
export class GoogleSigninHandler implements IQueryHandler<GoogleSigninQuery> {
  constructor(
    private readonly repository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly oAuthService: OAuthService,
  ) {}

  async execute({ token }: GoogleSigninQuery) {
    const { email } = await this.oAuthService.verifyToken(token);

    const user = await this.repository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { refreshToken, accessToken } = this.jwtService.signAuthToken(
      user.id,
    );

    return { user, refreshToken, accessToken };
  }
}
