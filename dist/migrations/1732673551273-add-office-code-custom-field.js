"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOfficeCodeCustomField1732673551273 = void 0;
class AddOfficeCodeCustomField1732673551273 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "address" ADD "customFieldsOfficecode" character varying(255)`, undefined);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "customFieldsOfficecode"`, undefined);
    }
}
exports.AddOfficeCodeCustomField1732673551273 = AddOfficeCodeCustomField1732673551273;
