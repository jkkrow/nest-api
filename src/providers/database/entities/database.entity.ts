import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export abstract class BaseEntityWithCreatedAt extends BaseEntity {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

export abstract class BaseEntityWithTimestamps extends BaseEntityWithCreatedAt {
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

export abstract class CompositeEntity {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

export abstract class CompositeEntityWithTimestamps extends CompositeEntity {
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
