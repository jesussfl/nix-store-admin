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

      // En Vendure, podemos obtener el nivel de stock actual así:
      // Si el sistema usa multiple stock locations, obtenemos la suma total
      const stockLevel = await this.connection
        .getRepository(ctx, "StockLevel")
        .createQueryBuilder("stockLevel")
        .where("stockLevel.productVariantId = :variantId", { variantId })
        .select("SUM(stockLevel.stockOnHand)", "stockOnHand")
        .getRawOne();

      return stockLevel?.stockOnHand || 0;
    } catch (error) {
      console.error(`Error getting stock level for variant ${variantId}:`, error);
      return 0;
    }
  }
}
