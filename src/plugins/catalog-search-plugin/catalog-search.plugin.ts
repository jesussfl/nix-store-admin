import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { shopApiExtensions } from "./api/api-extensions";

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: shopApiExtensions,
  },
})
export class CatalogSearchPlugin {}
