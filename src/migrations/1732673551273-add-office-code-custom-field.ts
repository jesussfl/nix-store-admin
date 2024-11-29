import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOfficeCodeCustomField1732673551273 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "address" ADD "customFieldsOfficecode" character varying(255)`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "customFieldsOfficecode"`, undefined);
   }

}
