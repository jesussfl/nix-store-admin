import { Order, OrderState, RequestContext, StockAllocationStrategy } from "@vendure/core";

/**
 * The default `DefaultStockAllocationStrategy` only allocates stock on the
 * `ArrangingPayment -> PaymentAuthorized | PaymentSettled` transition. The
 * `customOrderProcess` replaces the `ArrangingPayment` transitions and routes
 * payment through the custom `ValidatingPayment` state, which makes that
 * transition unreachable, so stock was never allocated.
 *
 * Without an `Allocation` row, `StockLocationStrategy.forSale()` resolves to no
 * stock locations, so no `Sale` movement is created on fulfillment and
 * `stockOnHand` is never decremented.
 *
 * Allocation happens on entry into `ValidatingPayment`, which is the same point
 * where `MyOrderPlacedStrategy` marks the Order as placed. Re-entering
 * `ValidatingPayment` from a later state does not re-allocate.
 */
export class PartialPaymentStockAllocationStrategy implements StockAllocationStrategy {
  shouldAllocateStock(ctx: RequestContext, fromState: OrderState, toState: OrderState, order: Order): boolean {
    if (fromState !== "ArrangingPayment") {
      return false;
    }
    return (
      toState === ("ValidatingPayment" as OrderState) || toState === "PaymentAuthorized" || toState === "PaymentSettled"
    );
  }
}
