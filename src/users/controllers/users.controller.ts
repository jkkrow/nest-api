import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Env } from 'src/config/config.schema';

@Controller('users')
export class UsersController {
  constructor(private configService: ConfigService<Env>) {}

  @Get()
  getName() {
    return this.configService.get('APPLICATION_NAME');
  }
}
