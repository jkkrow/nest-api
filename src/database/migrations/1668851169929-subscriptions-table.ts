import { MigrationInterface, QueryRunner } from 'typeorm';

export class subscriptionsTable1668851169929 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        publisher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subscriber_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        UNIQUE(publisher_id, subscriber_id)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE subscriptions
    `);
  }
}
