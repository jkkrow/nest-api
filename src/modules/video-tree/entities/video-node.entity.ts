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
@Tree('closure-table', {
  closureTableName: 'video_nodes',
  ancestorColumnName: () => 'ancestor_id',
  descendantColumnName: () => 'descendant_id',
})
export class VideoNodeEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  label: string;

  @Column({ type: 'varchar', length: 200 })
  url: string;

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

  @OneToOne(() => VideoTreeEntity, (videoTree) => videoTree.root, {
    onDelete: 'CASCADE',
  })
  tree: VideoTreeEntity;
}
