import { LanguageCode, ShippingCalculator } from "@vendure/core";
import { shippingDataSource } from "./shipping-data-source";

export const externalShippingCalculator = new ShippingCalculator({
  code: "external-shipping-calculator",
  description: [{ languageCode: LanguageCode.en, value: "Calculates cost from external source" }],
  args: {
    taxRate: {
      type: "int",
      ui: { component: "number-form-input", suffix: "%" },
      label: [{ languageCode: LanguageCode.en, value: "Tax rate" }],
    },
  },
  calculate: async (ctx, order, args) => {
    // `shippingDataSource` is assumed to fetch the data from some
    // external data source.
    const { rate, deliveryDate, courier } = await shippingDataSource.getRate({
      destination: order.shippingAddress,
      contents: order.lines,
    });

    return {
      price: rate,
      priceIncludesTax: ctx.channel.pricesIncludeTax,
      taxRate: args.taxRate,
      // metadata is optional but can be used to pass arbitrary
      // data about the shipping estimate to the storefront.
      metadata: { courier, deliveryDate },
    };
  },
});
