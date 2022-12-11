import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UnsubscribeChannelCommand } from '../impl/unsubscribe.command';
import { SubscriptionService } from '../../services/subscription.service';

@CommandHandler(UnsubscribeChannelCommand)
export class UnsubscribeChannelHandler
  implements ICommandHandler<UnsubscribeChannelCommand>
{
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async execute({ publisherId, subscriberId }: UnsubscribeChannelCommand) {
    await this.subscriptionService.unsubscribe(publisherId, subscriberId);
  }
}
