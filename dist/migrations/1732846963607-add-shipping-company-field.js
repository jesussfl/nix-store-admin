"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddShippingCompanyField1732846963607 = void 0;
class AddShippingCompanyField1732846963607 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "address" ADD "customFieldsShippingcompany" character varying(255)`, undefined);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "customFieldsShippingcompany"`, undefined);
    }
}
exports.AddShippingCompanyField1732846963607 = AddShippingCompanyField1732846963607;
