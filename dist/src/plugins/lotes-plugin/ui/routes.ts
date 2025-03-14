// import { registerReactRouteComponent } from "@vendure/admin-ui/react";
// import { LotesPage } from "./components/lotes-page/lotes-page";
import { getLoteDetailDocument, LoteDetailComponent } from "./components/lotes-detail-view/lotes-detail-view.component";
import { LoteListComponent } from "./components/lotes-list/lotes-list.component";
import { registerRouteComponent } from "@vendure/admin-ui/core";

export default [
  registerRouteComponent({
    component: LoteListComponent,

    path: "",
    title: "Lotes Page",
    breadcrumb: "Lotes",
  }),
  // Detail view
  registerRouteComponent({
    path: ":id",
    component: LoteDetailComponent,
    query: getLoteDetailDocument,
    entityKey: "getLote",
    getBreadcrumbs: (entity) => [
      {
        label: "Lote",
        link: ["/extensions", "lotes"],
      },
      {
        label: `#${entity?.id} (${entity?.name})`,
        link: [],
      },
    ],
  }),
];
