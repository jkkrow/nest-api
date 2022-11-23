import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBasicAuth } from '@nestjs/swagger';

import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { BasicGuard } from 'src/auth/guards/basic.guard';
import { MessageResponseDto } from 'src/common/dtos/message-response.dto';
import { EmailService } from '../services/email.service';
import { CreateBounceDto } from '../dtos/create-bounce.dto';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /* Create Bounce */
  /*--------------------------------------------*/
  @Post('bounces')
  @UseGuards(BasicGuard)
  @Serialize(MessageResponseDto, { status: 201 })
  @ApiBasicAuth()
  async createBounce(@Body() createBounceDto: CreateBounceDto) {
    await this.emailService.createBounce(createBounceDto);

    return {
      message: 'Bounced email stored in database successfully',
    };
  }
}
