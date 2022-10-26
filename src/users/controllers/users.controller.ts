import { Controller, Get } from '@nestjs/common';

import { ConfigService } from '../../config/config.service';

@Controller('users')
export class UsersController {
  constructor(private configService: ConfigService) {}

  @Get()
  getName() {
    return this.configService.get('APPLICATION_NAME');
  }
}
