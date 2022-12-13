import { Entity, PrimaryColumn, ManyToOne, CreateDateColumn } from 'typeorm';

import { UserEntity } from '../../user/entities/user.entity';

@Entity('subscriptions')
export class SubscriptionEntity {
  @PrimaryColumn({ type: 'uuid' })
  publisherId: string;

  @PrimaryColumn({ type: 'uuid' })
  subscriberId: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  publisher: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  subscriber: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}
