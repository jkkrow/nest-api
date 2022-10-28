import { Body, Controller, Post } from '@nestjs/common';

import { EmailService } from './email.service';
import { CreateBounceDto } from './dtos/create-bounce.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('bounces')
  createBounce(@Body() createBounceDto: CreateBounceDto) {
    return this.emailService.createBounce(createBounceDto);
  }
}
