import { MigrationInterface, QueryRunner } from 'typeorm';

export class bouncesTable1668851179916 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE bounces (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(30) NOT NULL UNIQUE,
            sender VARCHAR(30) NOT NULL,
            type VARCHAR(30) NOT NULL,
            description VARCHAR(200) NOT NULL,
            details VARCHAR(200) NOT NULL,
            message_stream VARCHAR(20) NOT NULL,
            bounced_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT now(),
            updated_at TIMESTAMP NOT NULL DEFAULT now()
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE bounces');
  }
}
