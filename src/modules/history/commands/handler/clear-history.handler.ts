import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ClearHistoryCommand } from '../impl/clear-history.command';
import { HistoryService } from '../../services/history.service';

@CommandHandler(ClearHistoryCommand)
export class ClearHistoryHandler
  implements ICommandHandler<ClearHistoryCommand>
{
  constructor(private readonly historyService: HistoryService) {}

  async execute({ userId }: ClearHistoryCommand) {
    await this.historyService.clear(userId);
  }
}
