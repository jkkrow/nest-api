import {
  Entity,
  Column,
  OneToOne,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';

import { BaseEntityWithTimestamps } from 'src/providers/database/entities/database.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import { VideoNodeEntity } from './video-node.entity';
import {
  VIDEO_TREE_STATUS,
  VideoTreeStatus,
} from '../constants/video-tree.contstant';

@Entity('video_trees')
export class VideoTreeEntity extends BaseEntityWithTimestamps {
  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column({ type: 'varchar', length: 200 })
  thumbnail: string;

  @Column({ type: 'real' })
  size: number;

  @Column({ type: 'real' })
  maxDuration: number;

  @Column({ type: 'real' })
  minDuration: number;

  @Column({ type: 'enum', enum: Object.values(VIDEO_TREE_STATUS) })
  status: VideoTreeStatus;

  @Column({ type: 'boolean' })
  editing: boolean;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user: UserEntity;

  @OneToOne(() => VideoNodeEntity, (videoNode) => videoNode.tree, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'root_id' })
  root: VideoNodeEntity;

  @ManyToMany(() => CategoryEntity, { cascade: true, eager: true })
  @JoinTable({ name: 'categories_video_trees' })
  categories: CategoryEntity[];
}
