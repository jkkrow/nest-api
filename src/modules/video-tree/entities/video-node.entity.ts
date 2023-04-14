import {
  Entity,
  Check,
  Column,
  Tree,
  TreeParent,
  TreeChildren,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { BaseEntity } from 'src/providers/database/entities/database.entity';
import { VideoTreeEntity } from './video-tree.entity';

@Entity('video_nodes')
@Tree('closure-table', {
  closureTableName: 'video_nodes',
  ancestorColumnName: () => 'ancestor_id',
  descendantColumnName: () => 'descendant_id',
})
@Check('level >= 0')
@Check('size >= 0')
@Check('duration >= 0')
@Check('selection_time_start >= 0')
@Check('selection_time_end >= 0')
@Check('selection_time_end >= selection_time_start')
@Check('duration >= selection_time_end')
export class VideoNodeEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  label: string;

  @Column({ type: 'varchar', length: 300 })
  url: string;

  @Column({ type: 'varchar', length: 300, default: '' })
  thumbnail: string;

  @Column({ type: 'integer' })
  level: number;

  @Column({ type: 'real' })
  size: number;

  @Column({ type: 'real' })
  duration: number;

  @Column({ type: 'real' })
  selectionTimeStart: number;

  @Column({ type: 'real' })
  selectionTimeEnd: number;

  @TreeParent({ onDelete: 'CASCADE', orphanedRowAction: 'delete' } as any)
  parent: VideoNodeEntity;

  @TreeChildren({ cascade: true })
  children: VideoNodeEntity[];

  @OneToOne(() => VideoTreeEntity, (tree) => tree.root, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tree_id' })
  tree: VideoTreeEntity;
}
