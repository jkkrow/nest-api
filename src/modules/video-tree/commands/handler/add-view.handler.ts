import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AddViewCommand } from '../impl/add-view.command';
import { ViewService } from '../../services/view.service';

@CommandHandler(AddViewCommand)
export class AddViewHandler implements ICommandHandler<AddViewCommand> {
  constructor(private readonly viewService: ViewService) {}

  async execute({ videoId, ip, userId }: AddViewCommand) {
    await this.viewService.add(videoId, ip, userId);
  }
}
