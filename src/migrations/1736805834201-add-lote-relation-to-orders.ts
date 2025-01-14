import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLoteRelationToOrders1736805834201 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" ADD "customFieldsLoteid" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "customFields__fix_relational_custom_fields__" boolean`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "order"."customFields__fix_relational_custom_fields__" IS 'A work-around needed when only relational custom fields are defined on an entity'`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_f05e39bbd08c479f06bbb956476" FOREIGN KEY ("customFieldsLoteid") REFERENCES "lote"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_f05e39bbd08c479f06bbb956476"`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "order"."customFields__fix_relational_custom_fields__" IS 'A work-around needed when only relational custom fields are defined on an entity'`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFields__fix_relational_custom_fields__"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFieldsLoteid"`, undefined);
   }

}
