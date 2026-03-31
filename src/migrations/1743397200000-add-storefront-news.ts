import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStorefrontNews1743397200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "storefront_news" DROP CONSTRAINT "FK_storefront_news_asset"`);
    await queryRunner.query(`DROP TABLE "storefront_news"`);
  }
}
