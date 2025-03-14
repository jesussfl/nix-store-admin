"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { registerReactRouteComponent } from "@vendure/admin-ui/react";
// import { LotesPage } from "./components/lotes-page/lotes-page";
const lotes_detail_view_component_1 = require("./components/lotes-detail-view/lotes-detail-view.component");
const lotes_list_component_1 = require("./components/lotes-list/lotes-list.component");
const core_1 = require("@vendure/admin-ui/core");
exports.default = [
    (0, core_1.registerRouteComponent)({
        component: lotes_list_component_1.LoteListComponent,
        path: "",
        title: "Lotes Page",
        breadcrumb: "Lotes",
    }),
    // Detail view
    (0, core_1.registerRouteComponent)({
        path: ":id",
        component: lotes_detail_view_component_1.LoteDetailComponent,
        query: lotes_detail_view_component_1.getLoteDetailDocument,
        entityKey: "getLote",
        getBreadcrumbs: (entity) => [
            {
                label: "Lote",
                link: ["/extensions", "lotes"],
            },
            {
                label: `#${entity === null || entity === void 0 ? void 0 : entity.id} (${entity === null || entity === void 0 ? void 0 : entity.name})`,
                link: [],
            },
        ],
    }),
];
