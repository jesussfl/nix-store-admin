import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { AdminUiExtension } from "@vendure/ui-devkit/compiler";
import * as path from "path";
import { adminApiExtensions } from "./api/api-extensions";
import { LoteAdminResolver } from "./api/lote-admin.resolver";
import { Lote } from "./entities/lote.entity";
import { LoteService } from "./services/lote.service";
@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [Lote],
  providers: [LoteService],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [LoteAdminResolver],
  },
})
export class LotesPlugin {
  static ui: AdminUiExtension = {
    id: "lotes-ui",
    extensionPath: path.join(__dirname, "ui"),
    routes: [{ route: "lotes", filePath: "routes.ts" }],
    providers: ["providers.ts"],
  };
}
