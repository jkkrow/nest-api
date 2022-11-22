import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { ConfigService } from 'src/config/services/config.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext) {
    const apiKey = this.config.get('AUTH_CREDENTIALS_API_KEY');

    const request = context.switchToHttp().getRequest();
    const { api_key } = request.headers;

    if (!api_key || api_key !== apiKey) {
      return false;
    }

    return true;
  }
}
