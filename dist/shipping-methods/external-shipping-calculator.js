"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.externalShippingCalculator = void 0;
const core_1 = require("@vendure/core");
const shipping_data_source_1 = require("./shipping-data-source");
exports.externalShippingCalculator = new core_1.ShippingCalculator({
    code: "external-shipping-calculator",
    description: [{ languageCode: core_1.LanguageCode.en, value: "Calculates cost from external source" }],
    args: {
        taxRate: {
            type: "int",
            ui: { component: "number-form-input", suffix: "%" },
            label: [{ languageCode: core_1.LanguageCode.en, value: "Tax rate" }],
        },
    },
    calculate: async (ctx, order, args) => {
        // `shippingDataSource` is assumed to fetch the data from some
        // external data source.
        const { rate, deliveryDate, courier } = await shipping_data_source_1.shippingDataSource.getRate({
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
