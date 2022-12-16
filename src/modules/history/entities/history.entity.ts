import {
  Entity,
  PrimaryColumn,
  Check,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from 'src/modules/user/entities/user.entity';
import { VideoTreeEntity } from 'src/modules/video-tree/entities/video-tree.entity';

@Entity('histories')
@Check('progress >= 0')
@Check('total_progress >= 0')
@Check('total_progress >= progress')
export class HistoryEntity {
  @PrimaryColumn({ type: 'uuid' })
  videoId: string;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  activeNodeId: string;

  @Column({ type: 'real' })
  progress: number;

  @Column({ type: 'real' })
  totalProgress: number;

  @Column({ type: 'boolean' })
  ended: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => VideoTreeEntity, (tree) => tree.id, { onDelete: 'CASCADE' })
  video: VideoTreeEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserEntity;
}
