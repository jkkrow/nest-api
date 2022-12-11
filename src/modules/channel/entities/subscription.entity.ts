import { Entity, Column, Unique, ManyToOne, CreateDateColumn } from 'typeorm';

import { BaseEntity } from 'src/providers/database/entities/database.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('subscriptions')
@Unique(['publisherId', 'subscriberId'])
export class SubscriptionEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  publisherId: string;

  @Column({ type: 'uuid' })
  subscriberId: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  publisher: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  subscriber: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}
