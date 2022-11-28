import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

import { BaseEntity } from 'src/database/entities/database.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('subscriptions')
@Unique(['publisher', 'subscriber'])
export class SubscriptionEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'publisher_id' })
  publisher: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscriber_id' })
  subscriber: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}
