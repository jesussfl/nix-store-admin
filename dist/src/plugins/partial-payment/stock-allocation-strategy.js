"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartialPaymentStockAllocationStrategy = void 0;
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
class PartialPaymentStockAllocationStrategy {
    shouldAllocateStock(ctx, fromState, toState, order) {
        if (fromState !== "ArrangingPayment") {
            return false;
        }
        return (toState === "ValidatingPayment" || toState === "PaymentAuthorized" || toState === "PaymentSettled");
    }
}
exports.PartialPaymentStockAllocationStrategy = PartialPaymentStockAllocationStrategy;
