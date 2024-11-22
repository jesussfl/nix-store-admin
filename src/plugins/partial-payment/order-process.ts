import { OrderProcess } from "@vendure/core";

/**
 * Define new states "ValidatingPayment" and "PartiallyPaid", and set up the permitted transitions.
 */
export const customOrderProcess: OrderProcess<"ValidatingPayment" | "ReceivedForShipping"> = {
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
