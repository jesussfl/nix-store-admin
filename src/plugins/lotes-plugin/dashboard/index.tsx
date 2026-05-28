import { defineDashboardExtension } from "@vendure/dashboard";

import { loteDetailRoute, loteListRoute } from "./routes";

defineDashboardExtension({
  routes: [loteListRoute, loteDetailRoute],
});
