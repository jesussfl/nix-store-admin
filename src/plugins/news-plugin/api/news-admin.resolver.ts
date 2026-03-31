import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Allow, Ctx, PaginatedList, Permission, RequestContext, Transaction } from "@vendure/core";

import { StorefrontNews } from "../entities/storefront-news.entity";
import { StorefrontNewsInput, StorefrontNewsService } from "../services/storefront-news.service";

@Resolver()
export class StorefrontNewsAdminResolver {
  constructor(private storefrontNewsService: StorefrontNewsService) {}

  @Query()
  @Allow(Permission.ReadCatalog)
  storefrontNewsItems(
    @Ctx() ctx: RequestContext,
    @Args("options", { nullable: true }) options?: any
  ): Promise<PaginatedList<StorefrontNews>> {
    return this.storefrontNewsService.findAll(ctx, options);
  }

  @Query()
  @Allow(Permission.ReadCatalog)
  async getStorefrontNewsItem(@Ctx() ctx: RequestContext, @Args("newsId") newsId: string): Promise<StorefrontNews> {
    const newsItem = await this.storefrontNewsService.findOne(ctx, newsId);
    if (!newsItem) {
      throw new Error(`Storefront news item with ID ${newsId} not found`);
    }
    return newsItem;
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.CreateCatalog)
  createStorefrontNewsItem(@Ctx() ctx: RequestContext, @Args("input") input: StorefrontNewsInput): Promise<StorefrontNews> {
    return this.storefrontNewsService.create(ctx, input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog)
  updateStorefrontNewsItem(
    @Ctx() ctx: RequestContext,
    @Args("newsId") newsId: string,
    @Args("input") input: StorefrontNewsInput
  ): Promise<StorefrontNews> {
    return this.storefrontNewsService.update(ctx, newsId, input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.DeleteCatalog)
  deleteStorefrontNewsItem(@Ctx() ctx: RequestContext, @Args("newsId") newsId: string): Promise<boolean> {
    return this.storefrontNewsService.delete(ctx, newsId);
  }
}
