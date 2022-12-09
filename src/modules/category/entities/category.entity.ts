import { PrimaryColumn, Entity } from 'typeorm';

@Entity('categories')
export class CategoryEntity {
  @PrimaryColumn({ type: 'varchar', length: 30 })
  name: string;
}
