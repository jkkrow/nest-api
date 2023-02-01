import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTimestampsIndex1675252484543 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX video_trees_created_at_idx ON video_trees(created_at DESC)
    `);
    await queryRunner.query(`
      CREATE INDEX video_trees_updated_at_idx ON video_trees(updated_at DESC)
    `);
    await queryRunner.query(`
      CREATE INDEX subscriptions_created_at_idx ON subscriptions(created_at DESC)
    `);
    await queryRunner.query(`
      CREATE INDEX favorites_created_at_idx ON favorites(created_at DESC)
    `);
    await queryRunner.query(`
      CREATE INDEX histories_updated_at_idx ON histories(updated_at DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX video_trees_created_at_idx
    `);
    await queryRunner.query(`
      DROP INDEX video_trees_updated_at_idx
    `);
    await queryRunner.query(`
      DROP INDEX subscriptions_created_at_idx
    `);
    await queryRunner.query(`
      DROP INDEX favorites_created_at_idx
    `);
    await queryRunner.query(`
      DROP INDEX histories_updated_at_idx
    `);
  }
}
