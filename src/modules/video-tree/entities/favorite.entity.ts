import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';

import { CompositeEntity } from 'src/providers/database/entities/database.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { VideoTreeEntity } from './video-tree.entity';

@Entity('favorites')
export class FavoriteEntity extends CompositeEntity {
  @PrimaryColumn({ type: 'uuid' })
  videoId: string;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => VideoTreeEntity, (tree) => tree.id, { onDelete: 'CASCADE' })
  video: VideoTreeEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserEntity;
}
