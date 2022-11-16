import { MigrationInterface, QueryRunner } from 'typeorm';

export class usersTable1668498407756 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE user_type AS ENUM('native', 'google')`,
    );
    await queryRunner.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(30) NOT NULL,
          type user_type NOT NULL,
          email VARCHAR(30) NOT NULL UNIQUE,
          password VARCHAR(200) NOT NULL,
          picture VARCHAR(200) NOT NULL DEFAULT '',
          verified BOOLEAN NOT NULL DEFAULT false,
          admin BOOLEAN NOT NULL DEFAULT false,
          membership VARCHAR(100) REFERENCES memberships(id) ON DELETE CASCADE ON UPDATE CASCADE,
          created_at TIMESTAMP NOT NULL DEFAULT now(),
          updated_at TIMESTAMP NOT NULL DEFAULT now()
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users`);
  }
}
