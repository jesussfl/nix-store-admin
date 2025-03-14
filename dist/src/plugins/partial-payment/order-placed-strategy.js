"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyOrderPlacedStrategy = void 0;
/**
 * This OrderPlacedStrategy tells Vendure to set the Order as "placed"
 * when it transitions to the custom "ValidatingPayment" state.
 */
class MyOrderPlacedStrategy {
    shouldSetAsPlaced(ctx, fromState, toState) {
        return toState === "ValidatingPayment" || toState === "ReceivedForShipping";
    }
}
exports.MyOrderPlacedStrategy = MyOrderPlacedStrategy;
