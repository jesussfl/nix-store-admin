import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMultiShipping1733101761296 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order_line" ADD "customFieldsShippingtype" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "customFieldsShippingdescription" character varying(255)`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "customFieldsShippingdescription"`, undefined);
        await queryRunner.query(`ALTER TABLE "order_line" DROP COLUMN "customFieldsShippingtype"`, undefined);
   }

}
