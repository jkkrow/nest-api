import { MigrationInterface, QueryRunner } from 'typeorm';

export class membershipsTable1668851156524 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE membership_name AS ENUM('standard', 'business', 'enterprise')`,
    );
    await queryRunner.query(`
        CREATE TABLE memberships (
            id VARCHAR(100) PRIMARY KEY,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            name membership_name NOT NULL,
            expired_at TIMESTAMP NOT NULL,
            cancelled BOOLEAN NOT NULL
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE memberships`);
  }
}
