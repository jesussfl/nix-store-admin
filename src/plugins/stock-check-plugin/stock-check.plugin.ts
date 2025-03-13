import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { shopApiExtensions } from "./api/api-extensions";
import { StockCheckShopResolver } from "./api/stock-check.resolver";
import { StockCheckService } from "./services/stock-check.service";

/**
 * Plugin para verificar y exponer información sobre el nivel de stock de los productos
 */
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [StockCheckService],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [StockCheckShopResolver],
  },
})
export class StockCheckPlugin {}
