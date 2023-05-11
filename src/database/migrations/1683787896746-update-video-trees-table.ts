import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateVideoTreesTable1683787896746 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE video_trees
      ADD COLUMN default_thumbnail VARCHAR(300) NOT NULL DEFAULT ''
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE video_trees
      DROP COLUMN default_thumbnail
    `);
  }
}
