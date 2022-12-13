import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteHistoryCommand } from '../impl/delete-history.command';
import { HistoryService } from '../../services/history.service';

@CommandHandler(DeleteHistoryCommand)
export class DeleteHistoryHandler
  implements ICommandHandler<DeleteHistoryCommand>
{
  constructor(private readonly historyService: HistoryService) {}

  async execute({ videoId, userId }: DeleteHistoryCommand) {
    await this.historyService.delete(videoId, userId);
  }
}
