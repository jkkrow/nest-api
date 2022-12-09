import { Controller, Get, Post, Delete, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { PaginationRequest } from 'src/common/dtos/request/pagination.request';
import { MessageResponse } from 'src/common/dtos/response/message.response';
import { Role } from 'src/auth/decorators/role.decorator';
import { RequestUserId } from 'src/auth/decorators/user.decorator';
import { SubscriptionService } from '../services/subscription.service';
import { GetChannelQuery } from '../queries/impl/get-channel.query';
import { GetSubscribersQuery } from '../queries/impl/get-subscribers.query';
import { GetSubscribesQuery } from '../queries/impl/get-subscribes.query';
import { GetChannelResponse } from '../dtos/response/get-channel.response';
import { GetChannelsResponse } from '../dtos/response/get-channels.response';

@ApiTags('Channels')
@Controller('channels')
export class ChannelController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  /* Get Channel */
  /*--------------------------------------------*/
  @Get(':id')
  @Serialize(GetChannelResponse)
  async getChannel(@Param('id') id: string, @RequestUserId() userId?: string) {
    const query = new GetChannelQuery(id, userId);
    const channel = await this.queryBus.execute(query);

    return { channel };
  }

  /* Get Subscribers */
  /*--------------------------------------------*/
  @Get('current/subscribers')
  @Role('user')
  @Serialize(GetChannelsResponse)
  async getSubscribers(
    @Query() { page, max }: PaginationRequest,
    @RequestUserId() userId: string,
  ) {
    const query = new GetSubscribersQuery(userId, page, max);
    const { channels, count } = await this.queryBus.execute(query);

    return { channels, count };
  }

  /* Get Subscribes */
  /*--------------------------------------------*/
  @Get('current/subscribes')
  @Role('user')
  @Serialize(GetChannelsResponse)
  async getSubscribes(
    @Query() { page, max }: PaginationRequest,
    @RequestUserId() userId: string,
  ) {
    const query = new GetSubscribesQuery(userId, page, max);
    const { channels, count } = await this.queryBus.execute(query);

    return { channels, count };
  }

  /* Subscribe to Channel */
  /*--------------------------------------------*/
  @Post(':id/subscriptions')
  @Role('verified')
  @Serialize(MessageResponse, { status: 201 })
  async subscribe(@Param('id') id: string, @RequestUserId() userId: string) {
    await this.subscriptionService.subscribe(id, userId);

    return {
      message: 'Subscribed to channel successfully',
    };
  }

  /* Unsubscribe from Channel */
  /*--------------------------------------------*/
  @Delete(':id/subscriptions')
  @Role('verified')
  @Serialize(MessageResponse)
  async unsubscribe(@Param('id') id: string, @RequestUserId() userId: string) {
    await this.subscriptionService.unsubscribe(id, userId);

    return {
      message: 'Unsubscribed from channel successfully',
    };
  }

  /* Get Current Channel Videos */
  /*--------------------------------------------*/
  @Get('current/video-trees/:id')
  @Role('user')
  async getCurrentChannelVideoTrees() {
    return {};
  }
}
