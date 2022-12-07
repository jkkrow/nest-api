import { MigrationInterface, QueryRunner } from 'typeorm';

export class videoNodesClosureTable1670387796711 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE video_nodes_closure (
        ancestor_id UUID NOT NULL REFERENCES video_nodes(id) ON DELETE CASCADE,
        descendant_id UUID NOT NULL REFERENCES video_nodes(id) ON DELETE CASCADE,
        PRIMARY KEY(ancestor_id, descendant_id)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE video_nodes_closure
    `);
  }
}
