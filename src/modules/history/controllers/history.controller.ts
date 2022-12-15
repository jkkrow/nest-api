import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { Serialize } from 'src/common/decorators/serialize.decorator';
import { MessageResponse } from 'src/common/dtos/response/message.response';
import { Role } from 'src/auth/decorators/role.decorator';
import { CurrentUserId } from 'src/auth/decorators/user.decorator';
import { GetHistoriesQuery } from '../queries/impl/get-histories.query';
import { SaveHistoryCommand } from '../commands/impl/save-history.command';
import { DeleteHistoryCommand } from '../commands/impl/delete-history.command';
import { GetHistoriesRequest } from '../dtos/request/get-histories.request';
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
  async getHistories(
    @Query() { page, max, skipEnded }: GetHistoriesRequest,
    @CurrentUserId() userId: string,
  ) {
    const query = new GetHistoriesQuery(userId, { page, max }, skipEnded);
    const { histories, count } = await this.queryBus.execute(query);

    return { histories, count };
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
