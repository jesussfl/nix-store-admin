import { Injectable } from "@nestjs/common";
import { Asset, ID, ListQueryBuilder, ListQueryOptions, PaginatedList, RequestContext, TransactionalConnection } from "@vendure/core";

import { StorefrontNews } from "../entities/storefront-news.entity";

export interface StorefrontNewsInput {
  title: string;
  summary: string;
  imageAssetId?: ID | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  sortOrder?: number | null;
  isPublished?: boolean | null;
}

@Injectable()
export class StorefrontNewsService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder
  ) {}

  findAll(ctx: RequestContext, options?: ListQueryOptions<StorefrontNews>): Promise<PaginatedList<StorefrontNews>> {
    return this.listQueryBuilder
      .build(StorefrontNews, options, { ctx, relations: ["imageAsset"] })
      .getManyAndCount()
      .then(([items, totalItems]) => ({ items, totalItems }));
  }

  findPublished(ctx: RequestContext): Promise<StorefrontNews[]> {
    return this.connection.getRepository(ctx, StorefrontNews).find({
      where: { isPublished: true },
      relations: {
        imageAsset: true,
      },
      order: {
        sortOrder: "ASC",
        createdAt: "DESC",
      },
    });
  }

  findOne(ctx: RequestContext, newsId: ID): Promise<StorefrontNews | null> {
    return this.connection.getRepository(ctx, StorefrontNews).findOne({
      where: { id: newsId },
      relations: {
        imageAsset: true,
      },
    });
  }

  async create(ctx: RequestContext, input: StorefrontNewsInput): Promise<StorefrontNews> {
    const newsItem = this.connection.getRepository(ctx, StorefrontNews).create({
      title: input.title,
      summary: input.summary,
      imageAsset: await this.getAsset(ctx, input.imageAssetId),
      ctaText: input.ctaText ?? null,
      ctaLink: input.ctaLink ?? null,
      sortOrder: input.sortOrder ?? 0,
      isPublished: input.isPublished ?? true,
    });
    return this.connection.getRepository(ctx, StorefrontNews).save(newsItem);
  }

  async update(ctx: RequestContext, newsId: ID, input: StorefrontNewsInput): Promise<StorefrontNews> {
    const newsItem = await this.findOne(ctx, newsId);
    if (!newsItem) {
      throw new Error(`Storefront news item with ID ${newsId} not found`);
    }

    newsItem.title = input.title;
    newsItem.summary = input.summary;
    newsItem.imageAsset = await this.getAsset(ctx, input.imageAssetId);
    newsItem.ctaText = input.ctaText ?? null;
    newsItem.ctaLink = input.ctaLink ?? null;
    newsItem.sortOrder = input.sortOrder ?? 0;
    newsItem.isPublished = input.isPublished ?? true;

    return this.connection.getRepository(ctx, StorefrontNews).save(newsItem);
  }

  async delete(ctx: RequestContext, newsId: ID): Promise<boolean> {
    const newsItem = await this.findOne(ctx, newsId);
    if (!newsItem) {
      throw new Error(`Storefront news item with ID ${newsId} not found`);
    }

    await this.connection.getRepository(ctx, StorefrontNews).remove(newsItem);
    return true;
  }

  private async getAsset(ctx: RequestContext, assetId?: ID | null): Promise<Asset | null> {
    if (!assetId) {
      return null;
    }

    return this.connection.getRepository(ctx, Asset).findOne({
      where: { id: assetId },
    });
  }
}
