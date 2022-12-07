import { MigrationInterface, QueryRunner } from 'typeorm';

export class videoNodesTable1670387789510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE video_nodes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        parent_id UUID REFERENCES video_nodes(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        label VARCHAR(100) NOT NULL,
        url VARCHAR(200) NOT NULL,
        level INTEGER NOT NULL,
        size REAL NOT NULL,
        duration REAL NOT NULL,
        selection_time_start REAL NOT NULL,
        selection_time_end REAL NOT NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE video_nodes
    `);
  }
}
