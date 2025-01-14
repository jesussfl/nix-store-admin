import { OnApplicationBootstrap, Injectable } from "@nestjs/common";
import { EventBus, OrderService, OrderStateTransitionEvent, PluginCommonModule, VendurePlugin } from "@vendure/core";
import { partialPaymentExtension } from "./api/api-extensions";
import { OrderPaymentResolver } from "./api/partial-payment.resolver";
import { MyCustomMutationResultResolver } from "./api/custom-mutation-result.resolver";
import { LoteService } from "../lotes-plugin/services/lote.service";
import { LotesPlugin } from "../lotes-plugin/lote.plugin";

@VendurePlugin({
  imports: [PluginCommonModule, LotesPlugin],
  shopApiExtensions: {
    schema: partialPaymentExtension,
    resolvers: [OrderPaymentResolver, MyCustomMutationResultResolver],
  },
  providers: [OrderService],
})
export class PartialPaymentPlugin implements OnApplicationBootstrap {
  private subscription: any;

  constructor(private eventBus: EventBus, private orderService: OrderService, private loteService: LoteService) {}

  async onApplicationBootstrap() {
    this.subscription = this.eventBus.ofType(OrderStateTransitionEvent).subscribe(async (event) => {
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
          } else {
            console.warn(`No lote found to associate with order ${event.order.id}`);
          }
        } catch (error) {
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
}
