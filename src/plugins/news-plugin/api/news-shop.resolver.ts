import { Query, Resolver } from "@nestjs/graphql";
import { Allow, Ctx, Permission, RequestContext } from "@vendure/core";

import { StorefrontNews } from "../entities/storefront-news.entity";
import { StorefrontNewsService } from "../services/storefront-news.service";

@Resolver()
export class StorefrontNewsShopResolver {
  constructor(private storefrontNewsService: StorefrontNewsService) {}

  @Query()
  @Allow(Permission.Public)
  storefrontNews(@Ctx() ctx: RequestContext): Promise<StorefrontNews[]> {
    return this.storefrontNewsService.findPublished(ctx);
  }
}
