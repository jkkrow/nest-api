import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { JwtService } from 'src/auth/services/jwt.service';
import { GetCredentialsQuery } from '../impl/get-credentials.query';

@QueryHandler(GetCredentialsQuery)
export class GetCredentialsHandler
  implements IQueryHandler<GetCredentialsQuery>
{
  constructor(private readonly jwtService: JwtService) {}

  async execute({ refreshToken }: GetCredentialsQuery) {
    const credentials = await this.jwtService.rotateRefreshToken(refreshToken);
    return credentials;
  }
}
