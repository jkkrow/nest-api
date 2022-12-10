import { Entity, Column, Unique, ManyToOne, CreateDateColumn } from 'typeorm';

import { BaseEntity } from 'src/providers/database/entities/database.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { VideoTreeEntity } from './video-tree.entity';

@Entity('favorites')
@Unique(['videoId', 'userId'])
export class FavoriteEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  videoId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => VideoTreeEntity, (tree) => tree.id, { onDelete: 'CASCADE' })
  video: VideoTreeEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}
