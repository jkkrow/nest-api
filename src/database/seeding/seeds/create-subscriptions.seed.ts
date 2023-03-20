import { Seeder, Factory } from 'typeorm-seeding';

import { SubscriptionEntity } from 'src/modules/channel/entities/subscription.entity';
import { SubscriptionContext } from '../factories/subscription.factory';

export default class CreateSubscriptions implements Seeder {
  async run(factory: Factory) {
    await factory<SubscriptionEntity, SubscriptionContext>(
      SubscriptionEntity,
    )().createMany(100);
  }
}
