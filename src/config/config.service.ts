import { Injectable } from '@nestjs/common';
import { ConfigService as DefaultConfigService } from '@nestjs/config';

import { EnvironmentVariables } from './config.schema';

@Injectable()
export class ConfigService extends DefaultConfigService<
  EnvironmentVariables,
  true
> {
  constructor() {
    super();
  }
}
