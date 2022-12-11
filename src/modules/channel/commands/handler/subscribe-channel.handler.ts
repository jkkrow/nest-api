import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SubscribeChannelCommand } from '../impl/subscribe.command';
import { SubscriptionService } from '../../services/subscription.service';

@CommandHandler(SubscribeChannelCommand)
export class SubscribeChannelHandler
  implements ICommandHandler<SubscribeChannelCommand>
{
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async execute({ publisherId, subscriberId }: SubscribeChannelCommand) {
    await this.subscriptionService.subscribe(publisherId, subscriberId);
  }
}
