import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1667989527727 implements MigrationInterface {
    name = 'Default1667989527727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "premiums" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "premiums" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "premiums" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "premiums" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "premiums" DROP COLUMN "payment_id"`);
        await queryRunner.query(`ALTER TABLE "premiums" ADD "payment_id" character varying(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "premiums" DROP COLUMN "expired_at"`);
        await queryRunner.query(`ALTER TABLE "premiums" ADD "expired_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP CONSTRAINT "UQ_c987fabb0255401ff3005715e69"`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "email" character varying(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD CONSTRAINT "UQ_c987fabb0255401ff3005715e69" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "from"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "from" character varying(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "type" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "description" character varying(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "details"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "details" character varying(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "message_stream"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "message_stream" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "bounced_at"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "bounced_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "picture"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "picture" character varying(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_348b796b2b59c165409758c4656" FOREIGN KEY ("premium_id") REFERENCES "premiums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_72d6a58741e41e884c901cbf46e" FOREIGN KEY ("users_id_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_fe58de196e87fd590779918d613" FOREIGN KEY ("users_id_2") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_fe58de196e87fd590779918d613"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_72d6a58741e41e884c901cbf46e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_348b796b2b59c165409758c4656"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "picture"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "picture" 'character varying' NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" 'character varying' NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" 'character varying' NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" 'character varying' NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" 'timestamp without time zone' NOT NULL DEFAULT now():`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" 'timestamp without time zone' NOT NULL DEFAULT now():`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "bounced_at"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "bounced_at" 'timestamp without time zone' NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "message_stream"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "message_stream" 'character varying' NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "details"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "details" 'character varying' NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "description" 'character varying' NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "type" 'character varying' NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "from"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "from" 'character varying' NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP CONSTRAINT "UQ_c987fabb0255401ff3005715e69"`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "email" 'character varying' NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD CONSTRAINT "UQ_c987fabb0255401ff3005715e69" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "updated_at" 'timestamp without time zone' NOT NULL DEFAULT now():`);
        await queryRunner.query(`ALTER TABLE "bounces" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "bounces" ADD "created_at" 'timestamp without time zone' NOT NULL DEFAULT now():`);
        await queryRunner.query(`ALTER TABLE "premiums" DROP COLUMN "expired_at"`);
        await queryRunner.query(`ALTER TABLE "premiums" ADD "expired_at" 'timestamp without time zone' NOT NULL`);
        await queryRunner.query(`ALTER TABLE "premiums" DROP COLUMN "payment_id"`);
        await queryRunner.query(`ALTER TABLE "premiums" ADD "payment_id" 'character varying' NOT NULL`);
        await queryRunner.query(`ALTER TABLE "premiums" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "premiums" ADD "updated_at" 'timestamp without time zone' NOT NULL DEFAULT now():`);
        await queryRunner.query(`ALTER TABLE "premiums" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "premiums" ADD "created_at" 'timestamp without time zone' NOT NULL DEFAULT now():`);
    }

}
