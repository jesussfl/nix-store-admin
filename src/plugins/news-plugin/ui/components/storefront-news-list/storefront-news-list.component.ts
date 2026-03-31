import { ChangeDetectionStrategy, Component } from "@angular/core";
import { SharedModule, TypedBaseListComponent } from "@vendure/admin-ui/core";
import { ResultOf, TypedDocumentNode } from "@graphql-typed-document-node/core";
import gql from "graphql-tag";

type StorefrontNewsListQuery = {
  storefrontNewsItems: {
    items: Array<{
      id: string;
      createdAt: string;
      updatedAt: string;
      title: string;
      summary: string;
      imageAsset?: {
        id: string;
        preview: string;
      } | null;
      sortOrder: number;
      isPublished: boolean;
    }>;
    totalItems: number;
  };
};

type StorefrontNewsListQueryVariables = {
  options: {
    filter: {
      id?: Record<string, unknown> | null;
      createdAt?: Record<string, unknown> | null;
      updatedAt?: Record<string, unknown> | null;
      title?: Record<string, unknown> | null;
      isPublished?: Record<string, unknown> | null;
    };
    sort: {
      createdAt?: "ASC" | "DESC";
      updatedAt?: "ASC" | "DESC";
      title?: "ASC" | "DESC";
      sortOrder?: "ASC" | "DESC";
      isPublished?: "ASC" | "DESC";
    };
    skip?: number;
    take?: number;
  };
};

const getStorefrontNewsListDocument = gql`
  query StorefrontNewsItems($options: StorefrontNewsListOptions) {
    storefrontNewsItems(options: $options) {
      items {
        id
        createdAt
        updatedAt
        title
        summary
        imageAsset {
          id
          preview
        }
        sortOrder
        isPublished
      }
      totalItems
    }
  }
` as TypedDocumentNode<StorefrontNewsListQuery, StorefrontNewsListQueryVariables>;

@Component({
  selector: "storefront-news-list",
  templateUrl: "./storefront-news-list.component.html",
  styleUrls: ["./storefront-news-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SharedModule],
})
export class StorefrontNewsListComponent extends TypedBaseListComponent<typeof getStorefrontNewsListDocument, "storefrontNewsItems"> {
  readonly filters = this.createFilterCollection()
    .addIdFilter()
    .addDateFilters()
    .addFilter({
      name: "title",
      type: { kind: "text" },
      label: "Titulo",
      filterField: "title",
    })
    .addFilter({
      name: "isPublished",
      type: { kind: "boolean" },
      label: "Publicado",
      filterField: "isPublished",
    })
    .connectToRoute(this.route);

  readonly sorts = this.createSortCollection()
    .defaultSort("sortOrder", "ASC")
    .addSort({ name: "createdAt" })
    .addSort({ name: "updatedAt" })
    .addSort({ name: "title" })
    .addSort({ name: "sortOrder" })
    .addSort({ name: "isPublished" })
    .connectToRoute(this.route);

  constructor() {
    super();
    super.configure({
      document: getStorefrontNewsListDocument,
      getItems: (data: ResultOf<typeof getStorefrontNewsListDocument>) => data.storefrontNewsItems,
      setVariables: (skip, take) => ({
        options: {
          skip,
          take,
          filter: {
            title: {
              contains: this.searchTermControl.value,
            },
            ...this.filters.createFilterInput(),
          },
          sort: this.sorts.createSortInput(),
        },
      }),
      refreshListOnChanges: [this.filters.valueChanges, this.sorts.valueChanges],
    });
  }
}
