import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SaveHistoryCommand } from '../impl/save-history.command';
import { HistoryService } from '../../services/history.service';

@CommandHandler(SaveHistoryCommand)
export class SaveHistoryHandler implements ICommandHandler<SaveHistoryCommand> {
  constructor(private readonly historyService: HistoryService) {}

  async execute(command: SaveHistoryCommand) {
    await this.historyService.save(command);
  }
}
