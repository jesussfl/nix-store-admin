import { OrderProcess } from "@vendure/core";

/**
 * Define new states "ValidatingPayment" and "PartiallyPaid", and set up the permitted transitions.
 */
export const customOrderProcess: OrderProcess<"ValidatingPayment" | "PartiallyPaid"> = {
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
      to: ["PartiallyPaid", "PaymentAuthorized", "PaymentSettled", "ArrangingAdditionalPayment", "Cancelled"],
    },
    PartiallyPaid: {
      to: ["PaymentAuthorized", "PaymentSettled", "ArrangingAdditionalPayment", "Cancelled"],
    },
  },
};
