import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { ConfigService } from 'src/config/services/config.service';

@Injectable()
export class BasicGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext) {
    const username = this.config.get('AUTH_CREDENTIALS_USERNAME');
    const password = this.config.get('AUTH_CREDENTIALS_PASSWORD');

    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization) {
      return false;
    }

    const hash = authorization.split(' ')[1];
    const [decodedUsername, decodedPassword] = Buffer.from(hash, 'base64')
      .toString('utf-8')
      .split(':');

    if (decodedUsername !== username || decodedPassword !== password) {
      return false;
    }

    return true;
  }
}
