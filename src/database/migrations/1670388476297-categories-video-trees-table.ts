import { MigrationInterface, QueryRunner } from 'typeorm';

export class categoriesVideoTreesTable1670388476297
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE categories_video_trees (
        category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        video_tree_id UUID NOT NULL REFERENCES video_trees(id) ON DELETE CASCADE,
        PRIMARY KEY(category_id, video_tree_id)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE categories_video_trees
    `);
  }
}
