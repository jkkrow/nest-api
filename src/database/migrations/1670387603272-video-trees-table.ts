import { MigrationInterface, QueryRunner } from 'typeorm';

export class videoTreesTable1670387603272 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE video_tree_status AS ENUM('public', 'private')
    `);
    await queryRunner.query(`
      CREATE TABLE video_trees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(1000) NOT NULL,
        thumbnail VARCHAR(200) NOT NULL,
        size REAL NOT NULL CHECK (size >= 0),
        max_duration REAL NOT NULL CHECK (max_duration >= 0),
        min_duration REAL NOT NULL CHECK (min_duration >= 0),
        status video_tree_status NOT NULL,
        editing BOOLEAN NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
        CHECK (max_duration >= min_duration)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE video_trees
    `);
  }
}
