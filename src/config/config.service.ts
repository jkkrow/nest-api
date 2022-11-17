import { Injectable } from '@nestjs/common';
import { ConfigService as BaseConfigService } from '@nestjs/config';

import { EnvironmentVariables } from './config.schema';

@Injectable()
export class ConfigService extends BaseConfigService<
  EnvironmentVariables,
  true
> {
  constructor() {
    super();
  }
}
