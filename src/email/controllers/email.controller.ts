import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBasicAuth } from '@nestjs/swagger';

import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { BasicGuard } from 'src/auth/guards/basic.guard';
import { MessageResponse } from 'src/common/dtos/response/message.response';
import { BounceService } from '../services/bounce.service';
import { CreateBounceRequest } from '../dtos/request/create-bounce.request';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly bounceService: BounceService) {}

  /* Create Bounce */
  /*--------------------------------------------*/
  @Post('bounces')
  @UseGuards(BasicGuard)
  @Serialize(MessageResponse, { status: 201 })
  @ApiBasicAuth()
  async createBounce(@Body() body: CreateBounceRequest) {
    await this.bounceService.create(body);

    return {
      message: 'Bounced email stored in database successfully',
    };
  }
}
