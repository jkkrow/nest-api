import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigration1667820528104 implements MigrationInterface {
    name = 'BaseMigration1667820528104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "database_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_708c579b647b6b23edd59a88c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bounces" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying(30) NOT NULL, "from" character varying(30) NOT NULL, "type" character varying(20) NOT NULL, "description" character varying(200) NOT NULL, "details" character varying(200) NOT NULL, "message_stream" character varying(20) NOT NULL, "bounced_at" TIMESTAMP NOT NULL, CONSTRAINT "UQ_c987fabb0255401ff3005715e69" UNIQUE ("email"), CONSTRAINT "PK_a2ed898b5caec996f5ac8a8d238" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."premiums_name_enum" AS ENUM('standard', 'business', 'enterprise')`);
        await queryRunner.query(`CREATE TABLE "premiums" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" "public"."premiums_name_enum" NOT NULL, "expired_at" TIMESTAMP NOT NULL, "cancelled" boolean NOT NULL, CONSTRAINT "PK_c3af30a2a8e64ba41d5091674bf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_type_enum" AS ENUM('native', 'google')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(30) NOT NULL, "type" "public"."users_type_enum" NOT NULL, "email" character varying(30) NOT NULL, "password" character varying(50) NOT NULL, "picture" character varying(200) NOT NULL, "verified" boolean NOT NULL DEFAULT false, "admin" boolean NOT NULL DEFAULT false, "premium_id" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_348b796b2b59c165409758c465" UNIQUE ("premium_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("users_id_1" uuid NOT NULL, "users_id_2" uuid NOT NULL, CONSTRAINT "PK_56938dc708b1914d51cb1f310da" PRIMARY KEY ("users_id_1", "users_id_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_72d6a58741e41e884c901cbf46" ON "subscriptions" ("users_id_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_fe58de196e87fd590779918d61" ON "subscriptions" ("users_id_2") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_348b796b2b59c165409758c4656" FOREIGN KEY ("premium_id") REFERENCES "premiums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_72d6a58741e41e884c901cbf46e" FOREIGN KEY ("users_id_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_fe58de196e87fd590779918d613" FOREIGN KEY ("users_id_2") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_fe58de196e87fd590779918d613"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_72d6a58741e41e884c901cbf46e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_348b796b2b59c165409758c4656"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe58de196e87fd590779918d61"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_72d6a58741e41e884c901cbf46"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_type_enum"`);
        await queryRunner.query(`DROP TABLE "premiums"`);
        await queryRunner.query(`DROP TYPE "public"."premiums_name_enum"`);
        await queryRunner.query(`DROP TABLE "bounces"`);
        await queryRunner.query(`DROP TABLE "database_entity"`);
    }

}
