import { MigrationInterface, QueryRunner } from 'typeorm';

export class historiesTable1670914526176 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE histories (
        video_id UUID NOT NULL REFERENCES video_trees(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        active_node_id UUID NOT NULL,
        progress REAL NOT NULL CHECK (progress >= 0),
        total_progress REAL NOT NULL CHECK (total_progress >= 0),
        ended BOOLEAN NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY (video_id, user_id),
        CHECK (total_progress >= progress)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE histories
    `);
  }
}
