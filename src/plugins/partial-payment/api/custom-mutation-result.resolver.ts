import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Ctx, RequestContext, ProductVariant } from "@vendure/core";

@Resolver("MyCustomMutationResult")
export class MyCustomMutationResultResolver {
  @ResolveField()
  __resolveType(value: any): string {
    // If it has an "id" property we can assume it is an Order.
    return value.hasOwnProperty("id") ? "Order" : "MyCustomErrorResult";
  }
}
