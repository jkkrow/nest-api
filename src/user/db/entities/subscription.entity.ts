import { CreateDateColumn, Entity, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from 'src/database/entities/database.entity';
import { UserEntity } from './user.entity';

@Entity('subscriptions')
@Unique(['publisher', 'subscriber'])
export class SubscriptionEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.id, { cascade: true })
  publisher: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { cascade: true })
  subscriber: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}
