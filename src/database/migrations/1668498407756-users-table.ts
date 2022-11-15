import { MigrationInterface, QueryRunner } from 'typeorm';

export class usersTable1668498407756 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE user_type AS ENUM('native', 'google')`,
    );
    await queryRunner.query(
      `CREATE TYPE premium_name AS ENUM('standard', 'business', 'enterprise')`,
    );
    await queryRunner.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(30) NOT NULL,
          type user_type NOT NULL,
          email VARCHAR(30) NOT NULL UNIQUE,
          password VARCHAR(50) NOT NULL,
          picture VARCHAR(200) NOT NULL DEFAULT '',
          verified BOOLEAN NOT NULL DEFAULT false,
          admin BOOLEAN NOT NULL DEFAULT false,
          premium_id VARCHAR(100),
          premium_name premium_name,
          premium_expired_at TIMESTAMP,
          premium_cancelled BOOLEAN,
          created_at TIMESTAMP NOT NULL DEFAULT now(),
          updated_at TIMESTAMP NOT NULL DEFAULT now()
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users`);
  }
}
