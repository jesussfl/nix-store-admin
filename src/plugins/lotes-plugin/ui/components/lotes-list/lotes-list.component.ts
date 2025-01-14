import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TypedBaseListComponent, SharedModule } from "@vendure/admin-ui/core";
import { graphql } from "../../gql";
// This is the TypedDocumentNode generated by GraphQL Code Generator

const getLoteListDocument = graphql(`
  query AllLotes($options: LoteListOptions) {
    allLotes(options: $options) {
      items {
        id
        createdAt
        updatedAt
        name
        description
      }
      totalItems
    }
  }
`);

@Component({
  selector: "lotes-list",
  templateUrl: "./lotes-list.component.html",
  styleUrls: ["./lotes-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SharedModule],
})
export class LoteListComponent extends TypedBaseListComponent<typeof getLoteListDocument, "allLotes"> {
  // Here we set up the filters that will be available
  // to use in the data table
  readonly filters = this.createFilterCollection()
    .addIdFilter()
    .addDateFilters()
    .addFilter({
      name: "name",
      type: { kind: "text" },
      label: "Name",
      filterField: "name",
    })
    .addFilter({
      name: "description",
      type: { kind: "text" },
      label: "Description",
      filterField: "description",
    })
    // .addFilter({
    //   name: "rating",
    //   type: { kind: "number" },
    //   label: "Rating",
    //   filterField: "rating",
    // })
    // .addFilter({
    //   name: "authorName",
    //   type: { kind: "text" },
    //   label: "Author",
    //   filterField: "authorName",
    // })
    .connectToRoute(this.route);

  // Here we set up the sorting options that will be available
  // to use in the data table
  readonly sorts = this.createSortCollection()
    .defaultSort("createdAt", "DESC")
    .addSort({ name: "createdAt" })
    .addSort({ name: "updatedAt" })
    .addSort({ name: "name" })
    .addSort({ name: "description" })
    // .addSort({ name: "rating" })
    // .addSort({ name: "authorName" })
    .connectToRoute(this.route);

  constructor() {
    super();
    super.configure({
      document: getLoteListDocument,
      getItems: (data) => {
        // Log the data items here
        console.log("Retrieved data:", data.allLotes);
        return data.allLotes;
      },
      setVariables: (skip, take) => ({
        options: {
          skip,
          take,
          filter: {
            name: {
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
