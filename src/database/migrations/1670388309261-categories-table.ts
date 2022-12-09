import { MigrationInterface, QueryRunner } from 'typeorm';

export class categoriesTable1670388309261 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE categories (
        name VARCHAR(30) PRIMARY KEY
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE categories
    `);
  }
}
