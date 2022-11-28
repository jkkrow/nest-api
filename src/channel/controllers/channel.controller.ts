import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Channels')
@Controller('channels')
export class ChannelController {
  @Get('/id')
  async getChannel() {
    return;
  }
}
