import { MigrationInterface, QueryRunner } from 'typeorm';

export class channelsView1671435720268 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE VIEW channels AS (
        SELECT
          u.id AS id,
          u.name AS name,
          u.picture AS picture,
          COUNT(DISTINCT v.id) AS videos,
          COUNT(DISTINCT s.subscriber_id) AS subscribers
        FROM
          users AS u
          LEFT JOIN video_trees AS v ON v.creator_id = u.id AND v.editing = FALSE
          LEFT JOIN subscriptions AS s ON s.publisher_id = u.id
        GROUP BY
          u.id
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP VIEW channels
    `);
  }
}
