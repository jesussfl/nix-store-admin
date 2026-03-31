"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddStorefrontNews1743397200000 = void 0;
class AddStorefrontNews1743397200000 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "storefront_news" (
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "id" SERIAL NOT NULL,
        "title" character varying NOT NULL,
        "summary" text NOT NULL,
        "ctaText" character varying,
        "ctaLink" character varying,
        "sortOrder" integer NOT NULL DEFAULT 0,
        "isPublished" boolean NOT NULL DEFAULT true,
        "imageAssetId" integer,
        CONSTRAINT "FK_storefront_news_asset" FOREIGN KEY ("imageAssetId") REFERENCES "asset"("id") ON DELETE SET NULL ON UPDATE NO ACTION,
        CONSTRAINT "PK_storefront_news_id" PRIMARY KEY ("id")
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "storefront_news" DROP CONSTRAINT "FK_storefront_news_asset"`);
        await queryRunner.query(`DROP TABLE "storefront_news"`);
    }
}
exports.AddStorefrontNews1743397200000 = AddStorefrontNews1743397200000;
