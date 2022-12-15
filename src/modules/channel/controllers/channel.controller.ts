import { Controller, Get, Post, Delete, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { Serialize } from 'src/common/decorators/serialize.decorator';
import { PaginationRequest } from 'src/common/dtos/request/pagination.request';
import { MessageResponse } from 'src/common/dtos/response/message.response';
import { Role } from 'src/auth/decorators/role.decorator';
import { CurrentUserId } from 'src/auth/decorators/user.decorator';
import { GetChannelQuery } from '../queries/impl/get-channel.query';
import { GetSubscribersQuery } from '../queries/impl/get-subscribers.query';
import { GetSubscribesQuery } from '../queries/impl/get-subscribes.query';
import { SubscribeChannelCommand } from '../commands/impl/subscribe.command';
import { UnsubscribeChannelCommand } from '../commands/impl/unsubscribe.command';
import { GetChannelResponse } from '../dtos/response/get-channel.response';
import { GetChannelsResponse } from '../dtos/response/get-channels.response';

@ApiTags('Channels')
@Controller('channels')
export class ChannelController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /* Get Channel */
  /*--------------------------------------------*/
  @Get(':id')
  @Serialize(GetChannelResponse)
  async getChannel(@Param('id') id: string, @CurrentUserId() userId?: string) {
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
    @Query() params: PaginationRequest,
    @CurrentUserId() userId: string,
  ) {
    const query = new GetSubscribersQuery(userId, params);
    const { channels, count } = await this.queryBus.execute(query);

    return { channels, count };
  }

  /* Get Subscribes */
  /*--------------------------------------------*/
  @Get('current/subscribes')
  @Role('user')
  @Serialize(GetChannelsResponse)
  async getSubscribes(
    @Query() params: PaginationRequest,
    @CurrentUserId() userId: string,
  ) {
    const query = new GetSubscribesQuery(userId, params);
    const { channels, count } = await this.queryBus.execute(query);

    return { channels, count };
  }

  /* Subscribe to Channel */
  /*--------------------------------------------*/
  @Post(':id/subscriptions')
  @Role('verified')
  @Serialize(MessageResponse, { status: 201 })
  async subscribeChannel(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ) {
    const command = new SubscribeChannelCommand(id, userId);
    await this.commandBus.execute(command);

    return { message: 'Subscribed to channel successfully' };
  }

  /* Unsubscribe from Channel */
  /*--------------------------------------------*/
  @Delete(':id/subscriptions')
  @Role('verified')
  @Serialize(MessageResponse)
  async unsubscribeChannel(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ) {
    const command = new UnsubscribeChannelCommand(id, userId);
    await this.commandBus.execute(command);

    return { message: 'Unsubscribed from channel successfully' };
  }

  /* Get Current Channel Videos */
  /*--------------------------------------------*/
  @Get('current/video-trees/:id')
  @Role('user')
  async getCurrentChannelVideoTrees() {
    return {};
  }
}
