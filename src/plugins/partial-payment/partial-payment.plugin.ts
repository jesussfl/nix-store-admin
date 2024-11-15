import { OrderService, PluginCommonModule, VendurePlugin } from "@vendure/core";
import { partialPaymentExtension } from "./api/api-extensions";
import { OrderPaymentResolver } from "./api/partial-payment.resolver";
import { MyCustomMutationResultResolver } from "./api/custom-mutation-result.resolver";

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: partialPaymentExtension,
    resolvers: [OrderPaymentResolver, MyCustomMutationResultResolver],
  },
  // compatibility: "^2.0.0",
  providers: [OrderService],
  // configuration: config => {
  //     // ...
  // },
})
export class PartialPaymentPlugin {}
