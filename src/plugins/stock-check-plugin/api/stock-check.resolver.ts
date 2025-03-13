import { Args, Query, Resolver } from "@nestjs/graphql";
import { Allow, Ctx, ID, Permission, RequestContext } from "@vendure/core";
import { StockCheckService } from "../services/stock-check.service";

@Resolver()
export class StockCheckShopResolver {
  constructor(private stockCheckService: StockCheckService) {}

  /**
   * Get the current stock level for a product variant
   */
  @Query()
  @Allow(Permission.Public) // Esta query es pública para que pueda ser accesible desde el storefront
  async currentStockLevel(@Ctx() ctx: RequestContext, @Args("variantId") variantId: ID): Promise<number> {
    return this.stockCheckService.getCurrentStockLevel(ctx, variantId);
  }
}
