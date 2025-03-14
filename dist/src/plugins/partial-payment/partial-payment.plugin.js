"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartialPaymentPlugin = void 0;
const core_1 = require("@vendure/core");
const api_extensions_1 = require("./api/api-extensions");
const partial_payment_resolver_1 = require("./api/partial-payment.resolver");
const custom_mutation_result_resolver_1 = require("./api/custom-mutation-result.resolver");
const lote_service_1 = require("../lotes-plugin/services/lote.service");
const lote_plugin_1 = require("../lotes-plugin/lote.plugin");
let PartialPaymentPlugin = class PartialPaymentPlugin {
    constructor(eventBus, orderService, loteService) {
        this.eventBus = eventBus;
        this.orderService = orderService;
        this.loteService = loteService;
    }
    async onApplicationBootstrap() {
        this.subscription = this.eventBus.ofType(core_1.OrderStateTransitionEvent).subscribe(async (event) => {
            if (event.toState === "ArrangingPayment") {
                try {
                    // Fetch the last lote
                    const lote = await this.loteService.findLastLote(event.ctx);
                    if (lote) {
                        // Update the order with the loteId
                        await this.orderService.updateCustomFields(event.ctx, event.order.id, {
                            loteId: lote.id,
                        });
                        console.log(`Added lote ${lote.id} to order ${event.order.id}`);
                    }
                    else {
                        console.warn(`No lote found to associate with order ${event.order.id}`);
                    }
                }
                catch (error) {
                    console.error(`Error handling OrderStateTransitionEvent for order ${event.order.id}:`, error);
                }
            }
        });
    }
    onApplicationShutdown() {
        // Clean up the subscription to avoid memory leaks
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
};
exports.PartialPaymentPlugin = PartialPaymentPlugin;
exports.PartialPaymentPlugin = PartialPaymentPlugin = __decorate([
    (0, core_1.VendurePlugin)({
        imports: [core_1.PluginCommonModule, lote_plugin_1.LotesPlugin],
        shopApiExtensions: {
            schema: api_extensions_1.partialPaymentExtension,
            resolvers: [partial_payment_resolver_1.OrderPaymentResolver, custom_mutation_result_resolver_1.MyCustomMutationResultResolver],
        },
        providers: [core_1.OrderService],
    }),
    __metadata("design:paramtypes", [core_1.EventBus, core_1.OrderService, lote_service_1.LoteService])
], PartialPaymentPlugin);
