import { MigrationInterface, QueryRunner } from 'typeorm';

export class subscriptionsTable1668851169929 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE subscriptions (
        publisher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subscriber_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        PRIMARY KEY (publisher_id, subscriber_id)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE subscriptions
    `);
  }
}
