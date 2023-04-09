import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ConfigService } from 'src/config/services/config.service';
import { UnauthorizedException } from 'src/common/exceptions';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const apiKey = this.config.get('AUTH_CREDENTIALS_API_KEY');
    const errorMessage = 'Invalid auth credentials (api key)';

    const request = context.switchToHttp().getRequest();
    const { secret } = request.headers;

    if (!secret || secret !== apiKey) {
      throw new UnauthorizedException(errorMessage);
    }

    return true;
  }
}
