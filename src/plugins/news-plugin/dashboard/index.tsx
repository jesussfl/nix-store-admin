import { defineDashboardExtension } from "@vendure/dashboard";

import { storefrontNewsDetailRoute, storefrontNewsListRoute } from "./routes";

defineDashboardExtension({
  routes: [storefrontNewsListRoute, storefrontNewsDetailRoute],
});
