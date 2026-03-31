"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLoteRelationToOrders1736805834201 = void 0;
class AddLoteRelationToOrders1736805834201 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "customFieldsLoteid" integer`);
        await queryRunner.query(`ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "customFields__fix_relational_custom_fields__" boolean`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."customFields__fix_relational_custom_fields__" IS 'A work-around needed when only relational custom fields are defined on an entity'`);
        await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'FK_f05e39bbd08c479f06bbb956476'
        ) THEN
          ALTER TABLE "order"
          ADD CONSTRAINT "FK_f05e39bbd08c479f06bbb956476"
          FOREIGN KEY ("customFieldsLoteid") REFERENCES "lote"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT IF EXISTS "FK_f05e39bbd08c479f06bbb956476"`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."customFields__fix_relational_custom_fields__" IS 'A work-around needed when only relational custom fields are defined on an entity'`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN IF EXISTS "customFields__fix_relational_custom_fields__"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN IF EXISTS "customFieldsLoteid"`);
    }
}
exports.AddLoteRelationToOrders1736805834201 = AddLoteRelationToOrders1736805834201;
