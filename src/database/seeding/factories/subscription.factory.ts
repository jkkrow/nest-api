import { define, factory } from 'typeorm-seeding';

import { SubscriptionEntity } from 'src/modules/channel/entities/subscription.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export interface SubscriptionContext {
  to?: string;
  by?: string;
}

define<SubscriptionEntity, SubscriptionContext>(
  SubscriptionEntity,
  (_, context?) => {
    const subscription = new SubscriptionEntity();

    const publisher = context?.to
      ? { id: context.to }
      : (factory(UserEntity)() as any);
    const subscriber = context?.by
      ? { id: context.by }
      : (factory(UserEntity)() as any);

    subscription.publisherId = publisher.id;
    subscription.subscriberId = subscriber.id;
    subscription.publisher = publisher;
    subscription.subscriber = subscriber;

    return subscription;
  },
);
