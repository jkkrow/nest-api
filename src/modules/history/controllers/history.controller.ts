import { Controller, Put, Delete, Body, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { Serialize } from 'src/common/decorators/serialize.decorator';
import { MessageResponse } from 'src/common/dtos/response/message.response';
import { Role } from 'src/auth/decorators/role.decorator';
import { CurrentUserId } from 'src/auth/decorators/user.decorator';
import { SaveHistoryCommand } from '../commands/impl/save-history.command';
import { DeleteHistoryCommand } from '../commands/impl/delete-history.command';
import { SaveHistoryRequest } from '../dtos/request/save-history.request';

@ApiTags('Histories')
@Controller('histories')
export class HistoryController {
  constructor(private readonly commandBus: CommandBus) {}

  /* Save History */
  /*--------------------------------------------*/
  @Put('/:videoId')
  @Role('user')
  @Serialize(MessageResponse, { status: 201 })
  async saveHistory(
    @Body()
    { activeNodeId, progress, totalProgress, ended }: SaveHistoryRequest,
    @Param('videoId') videoId: string,
    @CurrentUserId() userId: string,
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
    @CurrentUserId() userId: string,
  ) {
    const command = new DeleteHistoryCommand(videoId, userId);
    await this.commandBus.execute(command);

    return { message: 'History deleted successfully' };
  }
}
