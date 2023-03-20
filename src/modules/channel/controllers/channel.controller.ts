import { Controller, Get, Post, Delete, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { Serialize } from 'src/common/decorators/serialize.decorator';
import { PaginationRequest } from 'src/common/dtos/request/pagination.request';
import { MessageResponse } from 'src/common/dtos/response/message.response';
import { Role } from 'src/auth/decorators/role.decorator';
import { CurrentUserId } from 'src/auth/decorators/user.decorator';
import { GetCreatedVideoTreesQuery } from 'src/modules/video-tree/queries/impl/get-created-video-trees.query';
import { GetCreatedVideoTreeQuery } from 'src/modules/video-tree/queries/impl/get-created-video-tree.query';
import { GetCreatedVideoNodeQuery } from 'src/modules/video-tree/queries/impl/get-created-video-node.query';
import { GetChannelVideoTreesQuery } from 'src/modules/video-tree/queries/impl/get-channel-video-trees.query';
import { GetFavoritedVideoTreesQuery } from 'src/modules/video-tree/queries/impl/get-favorited-video-trees.query';
import { GetWatchedVideoTreesQuery } from 'src/modules/video-tree/queries/impl/get-watched-video-trees.query';
import { GetCreatedVideoTreesResponse } from '../dtos/response/get-created-video-trees.response';
import { GetCreatedVideoTreeResponse } from 'src/modules/channel/dtos/response/get-created-video-tree.response';
import { GetCreatedVideoNodeResponse } from '../dtos/response/get-created-video-node.response';
import { GetChannelQuery } from '../queries/impl/get-channel.query';
import { GetSubscribersQuery } from '../queries/impl/get-subscribers.query';
import { GetSubscribesQuery } from '../queries/impl/get-subscribes.query';
import { SubscribeChannelCommand } from '../commands/impl/subscribe.command';
import { UnsubscribeChannelCommand } from '../commands/impl/unsubscribe.command';
import { GetHistoriesRequest } from '../dtos/request/get-histories.request';
import { GetChannelResponse } from '../dtos/response/get-channel.response';
import { GetSubscribersResponse } from '../dtos/response/get-subscribers.response';
import { GetSubscribesResponse } from '../dtos/response/get-subscribes.response';
import { GetChannelVideoTreesResponse } from '../dtos/response/get-channel-video-trees.response';
import { GetFavoritesResponse } from '../dtos/response/get-favorites.response';
import { GetHistoriesResponse } from '../dtos/response/get-histories.response';

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
  @Serialize(GetSubscribersResponse)
  async getSubscribers(
    @Query() params: PaginationRequest,
    @CurrentUserId() userId: string,
  ) {
    const query = new GetSubscribersQuery(userId, params);
    const [items, count, token] = await this.queryBus.execute(query);

    return { items, count, token };
  }

  /* Get Subscribes */
  /*--------------------------------------------*/
  @Get('current/subscribes')
  @Role('user')
  @Serialize(GetSubscribesResponse)
  async getSubscribes(
    @Query() params: PaginationRequest,
    @CurrentUserId() userId: string,
  ) {
    const query = new GetSubscribesQuery(userId, params as any);
    const [items, count, token] = await this.queryBus.execute(query);

    return { items, count, token };
  }

  /* Get Favorited Videos */
  /*--------------------------------------------*/
  @Get('current/favorites')
  @Role('user')
  @Serialize(GetFavoritesResponse)
  async getFavoritedVideoTrees(
    @Query() params: PaginationRequest,
    @CurrentUserId() userId: string,
  ) {
    const query = new GetFavoritedVideoTreesQuery(userId, params);
    const [items, count, token] = await this.queryBus.execute(query);

    return { items, count, token };
  }

  /* Get Watched Videos */
  /*--------------------------------------------*/
  @Get('current/histories')
  @Role('user')
  @Serialize(GetHistoriesResponse)
  async getWatchedVideoTrees(
    @Query() { skipEnded, ...rest }: GetHistoriesRequest,
    @CurrentUserId() userId: string,
  ) {
    const query = new GetWatchedVideoTreesQuery(userId, skipEnded, rest);
    const [items, count, token] = await this.queryBus.execute(query);

    return { items, count, token };
  }

  /* Get Created Video Trees */
  /*--------------------------------------------*/
  @Get('current/video-trees')
  @Role('user')
  @Serialize(GetCreatedVideoTreesResponse)
  async getCreatedVideoTrees(
    @Query() params: PaginationRequest,
    @CurrentUserId() userId: string,
  ) {
    const query = new GetCreatedVideoTreesQuery(userId, params);
    const [items, count, token] = await this.queryBus.execute(query);

    return { items, count, token };
  }

  /* Get Created Video Tree */
  /*--------------------------------------------*/
  @Get('current/video-trees/:id')
  @Role('user')
  @Serialize(GetCreatedVideoTreeResponse)
  async getCreatedVideoTree(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ) {
    const query = new GetCreatedVideoTreeQuery(id, userId);
    const videoTree = await this.queryBus.execute(query);

    return { videoTree };
  }

  /* Get Created Video Node */
  /*--------------------------------------------*/
  @Get('current/video-trees/:id/video-nodes/:nodeId')
  @Role('user')
  @Serialize(GetCreatedVideoNodeResponse)
  async getCreatedVideoNode(
    @Param('id') treeId: string,
    @Param('nodeId') id: string,
    @CurrentUserId() userId: string,
  ) {
    const query = new GetCreatedVideoNodeQuery(id, treeId, userId);
    const videoNode = await this.queryBus.execute(query);

    return { videoNode };
  }

  /* Get Channel Videos */
  /*--------------------------------------------*/
  @Get(':id/video-trees')
  @Serialize(GetChannelVideoTreesResponse)
  async getChannelVideoTrees(
    @Param('id') id: string,
    @Query() params: PaginationRequest,
    @CurrentUserId() userId?: string,
  ) {
    const query = new GetChannelVideoTreesQuery(id, params, userId);
    const [items, count, token] = await this.queryBus.execute(query);

    return { items, count, token };
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
}
