import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateVideoTreesSearch1682150229606 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop the existing 'search' column and index
    await queryRunner.query(`ALTER TABLE video_trees DROP COLUMN search;`);

    // 2. Add a new 'search' column without the 'GENERATED ALWAYS AS' expression
    await queryRunner.query(
      `ALTER TABLE video_trees ADD COLUMN search tsvector;`,
    );

    // 3. Create the trigger function to update the 'search' column
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_video_trees_search()
      RETURNS trigger AS $$
      BEGIN
        NEW.search :=
          setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
          setweight(to_tsvector('simple', (
            SELECT COALESCE(STRING_AGG(categories.name, ' '), '')
            FROM categories
            JOIN categories_video_trees ON categories.name = categories_video_trees.category_name
            WHERE categories_video_trees.video_tree_id = NEW.id
          )), 'B') ||
          setweight(to_tsvector('simple', (
            SELECT users.name
            FROM users
            WHERE users.id = NEW.creator_id
          )), 'C') ||
          setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'D');
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_video_trees_search_on_category_change()
      RETURNS trigger AS $$
      DECLARE
        video_tree video_trees%ROWTYPE;
        video_tree_id UUID;
      BEGIN
        IF TG_OP = 'DELETE' THEN
          video_tree_id := OLD.video_tree_id;
        ELSE
          video_tree_id := NEW.video_tree_id;
        END IF;

        SELECT * INTO video_tree FROM video_trees WHERE id = video_tree_id;
    
        video_tree.search :=
          setweight(to_tsvector('english', COALESCE(video_tree.title, '')), 'A') ||
          setweight(to_tsvector('simple', (
            SELECT COALESCE(STRING_AGG(categories.name, ' '), '')
            FROM categories
            JOIN categories_video_trees ON categories.name = categories_video_trees.category_name
            WHERE categories_video_trees.video_tree_id = video_tree.id
          )), 'B') ||
          setweight(to_tsvector('simple', (
            SELECT users.name
            FROM users
            WHERE users.id = video_tree.creator_id
          )), 'C') ||
          setweight(to_tsvector('english', COALESCE(video_tree.description, '')), 'D');
    
        UPDATE video_trees SET search = video_tree.search WHERE id = video_tree.id;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 4. Create the trigger
    await queryRunner.query(`
      CREATE TRIGGER update_video_trees_search_trigger
      BEFORE INSERT OR UPDATE ON video_trees
      FOR EACH ROW EXECUTE FUNCTION update_video_trees_search();
    `);
    await queryRunner.query(`
      CREATE TRIGGER update_video_trees_search_on_category_change_trigger
      AFTER INSERT OR UPDATE OR DELETE ON categories_video_trees
      FOR EACH ROW EXECUTE FUNCTION update_video_trees_search_on_category_change();
    `);

    // 5. Create the index on the 'search' column
    await queryRunner.query(
      `CREATE INDEX video_trees_search_idx ON video_trees USING gin(search);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the trigger and trigger function
    await queryRunner.query(
      `DROP TRIGGER update_video_trees_search_trigger ON video_trees;`,
    );
    await queryRunner.query(
      `DROP TRIGGER update_video_trees_search_on_category_change_trigger ON categories_video_trees;`,
    );
    await queryRunner.query(`DROP FUNCTION update_video_trees_search;`);
    await queryRunner.query(
      `DROP FUNCTION update_video_trees_search_on_category_change;`,
    );

    // Drop the index and 'search' column
    await queryRunner.query(`DROP INDEX video_trees_search_idx;`);
    await queryRunner.query(`ALTER TABLE video_trees DROP COLUMN search;`);

    // Re-create the 'search' column with the original GENERATED ALWAYS AS expression
    await queryRunner.query(`
      ALTER TABLE video_trees
      ADD COLUMN search tsvector
      GENERATED ALWAYS AS (
        setweight(to_tsvector('english', title), 'A') || ' ' ||
        setweight(to_tsvector('english', description), 'B')
      ) stored;
    `);

    // Re-create the original index
    await queryRunner.query(
      `CREATE INDEX video_trees_search_idx ON video_trees USING gin(search);`,
    );
  }
}
