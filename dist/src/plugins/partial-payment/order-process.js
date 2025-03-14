"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customOrderProcess = void 0;
/**
 * Define new states "ValidatingPayment" and "PartiallyPaid", and set up the permitted transitions.
 */
exports.customOrderProcess = {
    transitions: {
        Created: {
            to: ["Cancelled", "Modifying"],
            mergeStrategy: "merge",
        },
        ArrangingPayment: {
            to: ["ValidatingPayment", "AddingItems", "Cancelled", "Modifying"],
            mergeStrategy: "replace",
        },
        ValidatingPayment: {
            to: ["PaymentSettled", "ArrangingAdditionalPayment", "Cancelled"],
        },
        PaymentSettled: {
            to: ["ReceivedForShipping", "ValidatingPayment", "ArrangingAdditionalPayment", "Cancelled"],
            mergeStrategy: "replace",
        },
        ReceivedForShipping: {
            to: ["PaymentSettled", "ArrangingAdditionalPayment", "Shipped", "PartiallyShipped", "Delivered", "PartiallyDelivered", "Cancelled"],
        },
        Delivered: {
            to: ["Cancelled", "ReceivedForShipping"],
        },
    },
};
