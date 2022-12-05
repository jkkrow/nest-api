import { Controller, Post, Redirect, Body, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

import { Role } from 'src/auth/decorators/role.decorator';
import { RequestUserId } from 'src/auth/decorators/user.decorator';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CreateVideoTreeCommand } from '../commands/impl/create-video-tree.command';
import { CreateVideoNodeCommand } from '../commands/impl/create-video-node.command';
import { CreateVideoNodeRequest } from '../dtos/request/create-video-node.request';
import { CreateVideoNodeResponse } from '../dtos/response/create-video-node.response';

@ApiTags('VideoTrees')
@Controller('video-trees')
export class VideoTreeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /* Create VideoTree */
  /*--------------------------------------------*/
  @Post()
  @Role('verified')
  @Redirect()
  async createVideoTree(@RequestUserId() userId: string) {
    const id = uuidv4();
    const command = new CreateVideoTreeCommand(id, userId);
    await this.commandBus.execute(command);

    return { url: `/users/current/video-trees/${id}` };
  }

  /* Create VideoNode */
  /*--------------------------------------------*/
  @Post(':treeId/video-nodes')
  @Role('verified')
  @Serialize(CreateVideoNodeResponse, { status: 201 })
  async createVideoNode(
    @Param('treeId') treeId: string,
    @Body() { parentId }: CreateVideoNodeRequest,
  ) {
    const id = uuidv4();
    const command = new CreateVideoNodeCommand(id, treeId, parentId);
    await this.commandBus.execute(command);

    return { id };
  }
}
