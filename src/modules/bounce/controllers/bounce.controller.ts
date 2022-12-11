import {
  Controller,
  Post,
  Delete,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiBasicAuth } from '@nestjs/swagger';

import { Serialize } from 'src/common/decorators/serialize.decorator';
import { MessageResponse } from 'src/common/dtos/response/message.response';
import { Role } from 'src/auth/decorators/role.decorator';
import { BasicGuard } from 'src/auth/guards/basic.guard';
import { BounceService } from '../services/bounce.service';
import { CreateBounceRequest } from '../dtos/request/create-bounce.request';

@ApiTags('Bounces')
@Controller('bounces')
export class BounceController {
  constructor(private readonly bounceService: BounceService) {}

  /* Create Bounce */
  /*--------------------------------------------*/
  @Post()
  @UseGuards(BasicGuard)
  @Serialize(MessageResponse, { status: 201 })
  @ApiBasicAuth()
  async createBounce(@Body() body: CreateBounceRequest) {
    await this.bounceService.create(body);

    return {
      message: 'Bounced email stored in database successfully',
    };
  }

  /* Delete Bounce */
  /*--------------------------------------------*/
  @Delete(':email')
  @Role('admin')
  @Serialize(MessageResponse)
  async deleteBounce(@Param('email') email: string) {
    await this.bounceService.delete(email);

    return {
      message: 'Bounced email deleted from database successfully',
    };
  }
}
