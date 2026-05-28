import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { adminApiExtensions, apiExtensions } from "./api/api-extensions";
import { LoteAdminResolver } from "./api/lote-admin.resolver";
import { Lote } from "./entities/lote.entity";
import { LoteService } from "./services/lote.service";

@VendurePlugin({
  imports: [PluginCommonModule],
  exports: [LoteService],
  entities: [Lote],
  providers: [LoteService],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [LoteAdminResolver],
  },
  shopApiExtensions: {
    schema: apiExtensions,
    resolvers: [],
  },
  dashboard: "./dashboard/index.tsx",
})
export class LotesPlugin {}
