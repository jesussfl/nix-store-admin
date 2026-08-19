import { Injectable } from "@nestjs/common";
import { ID, RequestContext, ProductVariantService, StockMovementService, TransactionalConnection } from "@vendure/core";

@Injectable()
export class StockCheckService {
  constructor(
    private connection: TransactionalConnection,
    private productVariantService: ProductVariantService,
    private stockMovementService: StockMovementService
  ) {}

  /**
   * Gets the current stock level for a product variant
   */
  async getCurrentStockLevel(ctx: RequestContext, variantId: ID): Promise<number> {
    try {
      // Obtenemos el ProductVariant
      const variant = await this.productVariantService.findOne(ctx, variantId);

      if (!variant) {
        throw new Error(`Product variant with ID ${variantId} not found`);
      }

      // Saleable stock is stockOnHand MINUS stockAllocated, matching Vendure's
      // own StockLocationStrategy.getAvailableStock(). Reporting raw stockOnHand
      // would advertise units already reserved by orders that are placed but not
      // yet fulfilled, letting the storefront oversell them.
      const stockLevel = await this.connection
        .getRepository(ctx, "StockLevel")
        .createQueryBuilder("stockLevel")
        .where("stockLevel.productVariantId = :variantId", { variantId })
        .select("SUM(stockLevel.stockOnHand)", "stockOnHand")
        .addSelect("SUM(stockLevel.stockAllocated)", "stockAllocated")
        .getRawOne();

      const onHand = Number(stockLevel?.stockOnHand ?? 0);
      const allocated = Number(stockLevel?.stockAllocated ?? 0);
      const saleable = onHand - allocated;

      return Number.isFinite(saleable) ? Math.max(0, saleable) : 0;
    } catch (error) {
      console.error(`Error getting stock level for variant ${variantId}:`, error);
      return 0;
    }
  }
}
