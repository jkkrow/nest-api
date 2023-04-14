import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateVideoNodesTable1681204708836 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE video_nodes
      ADD COLUMN thumbnail VARCHAR(300) NOT NULL DEFAULT ''
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE video_nodes
      DROP COLUMN thumbnail
    `);
  }
}
