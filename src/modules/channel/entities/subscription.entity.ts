import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';

import { CompositeEntity } from 'src/providers/database/entities/database.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('subscriptions')
export class SubscriptionEntity extends CompositeEntity {
  @PrimaryColumn({ type: 'uuid' })
  publisherId: string;

  @PrimaryColumn({ type: 'uuid' })
  subscriberId: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  publisher: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  subscriber: UserEntity;
}
