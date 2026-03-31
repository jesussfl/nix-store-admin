import { registerRouteComponent } from "@vendure/admin-ui/core";
import { ResultOf } from "@graphql-typed-document-node/core";

import {
  getStorefrontNewsDetailDocument,
  StorefrontNewsDetailComponent,
} from "./components/storefront-news-detail/storefront-news-detail.component";
import { StorefrontNewsListComponent } from "./components/storefront-news-list/storefront-news-list.component";

export default [
  registerRouteComponent({
    component: StorefrontNewsListComponent,
    path: "",
    title: "Noticias",
    breadcrumb: "Noticias",
  }),
  registerRouteComponent({
    path: ":id",
    component: StorefrontNewsDetailComponent,
    query: getStorefrontNewsDetailDocument,
    entityKey: "getStorefrontNewsItem",
    getBreadcrumbs: (entity: ResultOf<typeof getStorefrontNewsDetailDocument>["getStorefrontNewsItem"]) => [
      {
        label: "Noticias",
        link: ["/extensions", "storefront-news"],
      },
      {
        label: entity?.title ?? "Detalle",
        link: [],
      },
    ],
  }),
];
