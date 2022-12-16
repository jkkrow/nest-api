import { Entity, PrimaryColumn, ManyToOne, CreateDateColumn } from 'typeorm';

import { UserEntity } from 'src/modules/user/entities/user.entity';
import { VideoTreeEntity } from './video-tree.entity';

@Entity('favorites')
export class FavoriteEntity {
  @PrimaryColumn({ type: 'uuid' })
  videoId: string;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => VideoTreeEntity, (tree) => tree.id, { onDelete: 'CASCADE' })
  video: VideoTreeEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserEntity;
}
