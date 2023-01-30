import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { AuthService } from 'src/auth/services/auth.service';
import { GetCredentialsQuery } from '../impl/get-credentials.query';

@QueryHandler(GetCredentialsQuery)
export class GetCredentialsHandler
  implements IQueryHandler<GetCredentialsQuery>
{
  constructor(private readonly authService: AuthService) {}

  async execute({ refreshToken }: GetCredentialsQuery) {
    return this.authService.rotateCredentials(refreshToken);
  }
}
