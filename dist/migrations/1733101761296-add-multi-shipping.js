"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMultiShipping1733101761296 = void 0;
class AddMultiShipping1733101761296 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order_line" ADD "customFieldsShippingtype" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "customFieldsShippingdescription" character varying(255)`, undefined);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "customFieldsShippingdescription"`, undefined);
        await queryRunner.query(`ALTER TABLE "order_line" DROP COLUMN "customFieldsShippingtype"`, undefined);
    }
}
exports.AddMultiShipping1733101761296 = AddMultiShipping1733101761296;
