import {
  Controller,
  Post,
  Patch,
  Delete,
  Redirect,
  Body,
  Param,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

import { Role } from 'src/auth/decorators/role.decorator';
import { RequestUserId } from 'src/auth/decorators/user.decorator';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { MessageResponse } from 'src/common/dtos/response/message.response';
import { CreateVideoTreeCommand } from '../commands/impl/create-video-tree.command';
import { UpdateVideoTreeCommand } from '../commands/impl/update-video-tree.command';
import { DeleteVideoTreeCommand } from '../commands/impl/delete-video-tree.command';
import { CreateVideoNodeCommand } from '../commands/impl/create-video-node.command';
import { UpdateVideoNodeCommand } from '../commands/impl/update-video-node.command';
import { DeleteVideoNodeCommand } from '../commands/impl/delete-video-node.command';
import { UpdateVideoTreeRequest } from '../dtos/request/update-video-tree.request';
import { CreateVideoNodeRequest } from '../dtos/request/create-video-node.request';
import { CreateVideoNodeResponse } from '../dtos/response/create-video-node.response';
import { UpdateVideoNodeRequest } from '../dtos/request/update-video-node.request';

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

  /* Update VideoTree */
  /*--------------------------------------------*/
  @Patch(':treeId')
  @Role('verified')
  @Serialize(MessageResponse)
  async updateVideoTree(
    @Body() updates: UpdateVideoTreeRequest,
    @Param('treeId') treeId: string,
    @RequestUserId() userId: string,
  ) {
    const command = new UpdateVideoTreeCommand(treeId, updates, userId);
    await this.commandBus.execute(command);

    return { message: 'VideoTree updated successfully' };
  }

  /* Delete VideoTree */
  /*--------------------------------------------*/
  @Delete(':treeId')
  @Role('verified')
  @Serialize(MessageResponse)
  async deleteVideoTree(
    @Param('treeId') treeId: string,
    @RequestUserId() userId: string,
  ) {
    const command = new DeleteVideoTreeCommand(treeId, userId);
    await this.commandBus.execute(command);

    return { message: 'VideoTree deleted successfully' };
  }

  /* Create VideoNode */
  /*--------------------------------------------*/
  @Post(':treeId/video-nodes')
  @Role('verified')
  @Serialize(CreateVideoNodeResponse, { status: 201 })
  async createVideoNode(
    @Body() { parentId }: CreateVideoNodeRequest,
    @Param('treeId') treeId: string,
    @RequestUserId() userId: string,
  ) {
    const id = uuidv4();
    const command = new CreateVideoNodeCommand(id, treeId, parentId, userId);
    await this.commandBus.execute(command);

    return { id };
  }

  /* Update VideoNode */
  /*--------------------------------------------*/
  @Patch(':treeId/video-nodes/:nodeId')
  @Role('verified')
  @Serialize(MessageResponse)
  async updateVideoNode(
    @Body() updates: UpdateVideoNodeRequest,
    @Param('treeId') treeId: string,
    @Param('nodeId') nodeId: string,
    @RequestUserId() userId: string,
  ) {
    const command = new UpdateVideoNodeCommand(nodeId, treeId, updates, userId);
    await this.commandBus.execute(command);

    return { message: 'VideoNode updated successfully' };
  }

  /* Delete VideoNode */
  /*--------------------------------------------*/
  @Delete(':treeId/video-nodes/:nodeId')
  @Role('verified')
  @Serialize(MessageResponse)
  async deleteVideoNode(
    @Param('treeId') treeId: string,
    @Param('nodeId') nodeId: string,
    @RequestUserId() userId: string,
  ) {
    const command = new DeleteVideoNodeCommand(nodeId, treeId, userId);
    await this.commandBus.execute(command);

    return { message: 'VideoNode deleted successfully' };
  }
}
