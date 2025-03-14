"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customPaymentProcess = void 0;
/**
 * Define new "Validating" and "PartiallyPaid" Payment states, with transitions to support partial payment flows.
 */
exports.customPaymentProcess = {
    transitions: {
        Created: {
            to: ["Validating"],
            mergeStrategy: "merge",
        },
        Validating: {
            to: ["Settled", "Declined", "Cancelled", "Error"],
        },
        // PartiallyPaid: {
        //   to: ["Settled", "Cancelled"],
        // },
    },
};
