import { PaymentProcess } from "@vendure/core";

declare module "@vendure/core" {
  interface PaymentStates {
    Validating: never;
    PartiallyPaid: never;
  }
}

/**
 * Define new "Validating" and "PartiallyPaid" Payment states, with transitions to support partial payment flows.
 */
export const customPaymentProcess: PaymentProcess<"Validating" | "PartiallyPaid"> = {
  transitions: {
    Created: {
      to: ["Validating"],
      mergeStrategy: "replace",
    },

    Validating: {
      to: ["PartiallyPaid", "Authorized", "Settled", "Declined", "Cancelled", "Error"],
    },
    PartiallyPaid: {
      to: ["Settled", "Authorized", "Cancelled"],
    },
  },
};
