import { PluginCommonModule, VendurePlugin } from "@vendure/core";

import { adminApiExtensions, shopApiExtensions } from "./api/api-extensions";
import { StorefrontNewsAdminResolver } from "./api/news-admin.resolver";
import { StorefrontNewsShopResolver } from "./api/news-shop.resolver";
import { StorefrontNews } from "./entities/storefront-news.entity";
import { StorefrontNewsService } from "./services/storefront-news.service";

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [StorefrontNews],
  providers: [StorefrontNewsService],
  exports: [StorefrontNewsService],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [StorefrontNewsAdminResolver],
  },
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [StorefrontNewsShopResolver],
  },
  dashboard: "./dashboard/index.tsx",
})
export class NewsPlugin {}
