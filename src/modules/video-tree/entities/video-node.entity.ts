import {
  Entity,
  Column,
  Tree,
  TreeParent,
  TreeChildren,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from 'src/providers/database/entities/database.entity';
import { VideoTreeEntity } from './video-tree.entity';

@Entity('video_nodes')
@Tree('materialized-path')
export class VideoNodeEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  label: string;

  @Column({ type: 'varchar', length: 200 })
  url: string;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'real' })
  size: number;

  @Column({ type: 'real' })
  duration: number;

  @Column({ type: 'real' })
  selectionTimeStart: number;

  @Column({ type: 'real' })
  selectionTimeEnd: number;

  @TreeParent({ onDelete: 'CASCADE' })
  parent: VideoNodeEntity;

  @TreeChildren({ cascade: true })
  children: VideoNodeEntity[];

  @OneToOne(() => VideoTreeEntity, (videoTree) => videoTree.root, {
    onDelete: 'CASCADE',
  })
  tree: VideoTreeEntity;
}
