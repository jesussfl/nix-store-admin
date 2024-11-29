import { OrderService, PluginCommonModule, VendurePlugin } from "@vendure/core";
import { nationalShippingExtension } from "./api/api-extensions";
import { MyCustomMutationResultResolver } from "../partial-payment/api/custom-mutation-result.resolver";
import { OverrideExampleResolver } from "./api/custom.resolver";
// import { partialPaymentExtension } from "./api/api-extensions";
// import { OrderPaymentResolver } from "./api/partial-payment.resolver";
// import { MyCustomMutationResultResolver } from "./api/custom-mutation-result.resolver";

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    // schema: nationalShippingExtension,
    resolvers: [OverrideExampleResolver],
  },
  // compatibility: "^2.0.0",
  //   providers: [OrderService],
  // configuration: config => {
  //     // ...
  // },
})
export class NationalShippingPlugin {}
