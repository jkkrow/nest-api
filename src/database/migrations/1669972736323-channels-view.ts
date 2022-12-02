import { MigrationInterface, QueryRunner } from 'typeorm';

export class channelsView1669972736323 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE VIEW channels AS (
            SELECT
                users.id AS id,
                users.name AS name,
                users.picture AS picture,
                COUNT(DISTINCT subscriptions.subscriber_id) AS subscribers
            FROM users
            LEFT JOIN subscriptions ON subscriptions.publisher_id = users.id
            GROUP BY users.id
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP VIEW channels');
  }
}
