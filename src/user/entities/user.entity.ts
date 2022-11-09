import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';

import { DatabaseEntity } from 'src/database/entities/database.entity';
import { Premium } from './premium.embedded';

@Entity({ name: 'users' })
export class UserEntity extends DatabaseEntity {
  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'enum', enum: ['native', 'google'] })
  type: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  password: string;

  @Column({ type: 'varchar', length: 200 })
  picture: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'boolean', default: false })
  admin: boolean;

  @Column(() => Premium)
  premium: Premium;

  @ManyToMany(() => UserEntity, (user) => user.subscribes)
  @JoinTable({ name: 'subscriptions' })
  subscribers: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.subscribers)
  subscribes: UserEntity[];
}
