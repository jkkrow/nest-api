import { Controller, Get, Post, Param, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { MessageResponse } from 'src/common/dtos/response/message.response';
import { Role } from 'src/auth/decorators/role.decorator';
import { RequestUserId } from 'src/auth/decorators/user.decorator';
import { SubscriptionService } from '../services/subscription.service';

@ApiTags('Channels')
@Controller('channels')
export class ChannelController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /* Get Channel */
  /*--------------------------------------------*/
  @Get(':id')
  async getChannel() {
    return;
  }

  /* Subscribe to Channel */
  /*--------------------------------------------*/
  @Post(':id/subscriptions')
  @Role('user')
  @Serialize(MessageResponse, { status: 201 })
  async subscribe(@Param('id') id: string, @RequestUserId() userId: string) {
    await this.subscriptionService.subscribe(id, userId);

    return {
      message: 'Subscribed to channel successfully',
    };
  }

  /* Unsubscribe from Channel */
  /*--------------------------------------------*/
  @Post(':id/subscriptions/cancel')
  @HttpCode(200)
  @Role('user')
  @Serialize(MessageResponse)
  async unsubscribe(@Param('id') id: string, @RequestUserId() userId: string) {
    await this.subscriptionService.unsubscribe(id, userId);

    return {
      message: 'Unsubscribed from channel successfully',
    };
  }
}
