import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { AuthService } from 'src/auth/services/auth.service';
import { SignoutQuery } from '../impl/signout.query';

@QueryHandler(SignoutQuery)
export class SignoutHandler implements IQueryHandler<SignoutQuery> {
  constructor(private readonly authService: AuthService) {}

  async execute({ refreshToken }: SignoutQuery) {
    return this.authService.invalidateCredentials(refreshToken);
  }
}
