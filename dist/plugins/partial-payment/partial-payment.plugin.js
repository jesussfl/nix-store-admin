"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartialPaymentPlugin = void 0;
const core_1 = require("@vendure/core");
const api_extensions_1 = require("./api/api-extensions");
const partial_payment_resolver_1 = require("./api/partial-payment.resolver");
const custom_mutation_result_resolver_1 = require("./api/custom-mutation-result.resolver");
let PartialPaymentPlugin = class PartialPaymentPlugin {
};
exports.PartialPaymentPlugin = PartialPaymentPlugin;
exports.PartialPaymentPlugin = PartialPaymentPlugin = __decorate([
    (0, core_1.VendurePlugin)({
        imports: [core_1.PluginCommonModule],
        shopApiExtensions: {
            schema: api_extensions_1.partialPaymentExtension,
            resolvers: [partial_payment_resolver_1.OrderPaymentResolver, custom_mutation_result_resolver_1.MyCustomMutationResultResolver],
        },
        // compatibility: "^2.0.0",
        providers: [core_1.OrderService],
        // configuration: config => {
        //     // ...
        // },
    })
], PartialPaymentPlugin);
