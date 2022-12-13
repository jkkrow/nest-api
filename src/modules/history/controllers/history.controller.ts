import { Controller, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { Serialize } from 'src/common/decorators/serialize.decorator';
import { MessageResponse } from 'src/common/dtos/response/message.response';
import { Role } from 'src/auth/decorators/role.decorator';
import { RequestUserId } from 'src/auth/decorators/user.decorator';
import { SaveHistoryCommand } from '../commands/impl/save-history.command';
import { DeleteHistoryCommand } from '../commands/impl/delete-history.command';
import { SaveHistoryRequest } from '../dtos/request/save-history.request';

@ApiTags('Histories')
@Controller('historires')
export class HistoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /* Get Histories */
  /*--------------------------------------------*/
  @Get('/')
  @Role('user')
  async getHistories() {
    return {};
  }

  /* Save History */
  /*--------------------------------------------*/
  @Put('/:videoId')
  @Role('user')
  @Serialize(MessageResponse, { status: 201 })
  async saveHistory(
    @Body()
    { activeNodeId, progress, totalProgress, ended }: SaveHistoryRequest,
    @Param('videoId') videoId: string,
    @RequestUserId() userId: string,
  ) {
    const command = new SaveHistoryCommand(
      videoId,
      userId,
      activeNodeId,
      progress,
      totalProgress,
      ended,
    );
    await this.commandBus.execute(command);

    return { message: 'History saved successfully' };
  }

  /* Delete History */
  /*--------------------------------------------*/
  @Delete('/:videoId')
  @Role('user')
  @Serialize(MessageResponse)
  async deleteHistory(
    @Param('videoId') videoId: string,
    @RequestUserId() userId: string,
  ) {
    const command = new DeleteHistoryCommand(videoId, userId);
    await this.commandBus.execute(command);

    return { message: 'History deleted successfully' };
  }
}
