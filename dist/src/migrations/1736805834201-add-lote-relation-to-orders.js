"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLoteRelationToOrders1736805834201 = void 0;
class AddLoteRelationToOrders1736805834201 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order" ADD "customFieldsLoteid" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "customFields__fix_relational_custom_fields__" boolean`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "order"."customFields__fix_relational_custom_fields__" IS 'A work-around needed when only relational custom fields are defined on an entity'`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_f05e39bbd08c479f06bbb956476" FOREIGN KEY ("customFieldsLoteid") REFERENCES "lote"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_f05e39bbd08c479f06bbb956476"`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "order"."customFields__fix_relational_custom_fields__" IS 'A work-around needed when only relational custom fields are defined on an entity'`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFields__fix_relational_custom_fields__"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFieldsLoteid"`, undefined);
    }
}
exports.AddLoteRelationToOrders1736805834201 = AddLoteRelationToOrders1736805834201;
