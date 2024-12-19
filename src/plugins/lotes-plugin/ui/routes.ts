// import { registerReactRouteComponent } from "@vendure/admin-ui/react";
// import { LotesPage } from "./components/lotes-page/lotes-page";
import { LoteListComponent } from "./components/lotes-list/lotes-list.component";
import { registerRouteComponent } from "@vendure/admin-ui/core";

export default [
  registerRouteComponent({
    component: LoteListComponent,
    path: "",
    title: "Lotes Page",
    breadcrumb: "Lotes",
  }),
];
