import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

import { BaseEntity } from 'src/providers/database/entities/database.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('subscriptions')
@Unique(['publisherId', 'subscriberId'])
export class SubscriptionEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'publisher_id' })
  publisherId: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscriber_id' })
  subscriberId: string;

  @CreateDateColumn()
  createdAt: Date;
}
