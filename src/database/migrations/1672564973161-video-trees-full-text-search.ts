import { MigrationInterface, QueryRunner } from 'typeorm';

export class videoTreesFullTextSearch1672564973161
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE video_trees
        ADD COLUMN search tsvector
        GENERATED ALWAYS AS (
          setweight(to_tsvector('english', title), 'A') || ' ' ||
          setweight(to_tsvector('english', description), 'B')
        ) stored
    `);
    await queryRunner.query(`
      CREATE INDEX video_trees_search_idx ON video_trees USING GIN(search)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE video_trees DROP search
    `);
  }
}
