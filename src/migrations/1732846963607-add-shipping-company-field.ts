import {MigrationInterface, QueryRunner} from "typeorm";

export class AddShippingCompanyField1732846963607 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "address" ADD "customFieldsShippingcompany" character varying(255)`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "customFieldsShippingcompany"`, undefined);
   }

}
