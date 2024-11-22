import { PaymentProcess } from "@vendure/core";

declare module "@vendure/core" {
  interface PaymentStates {
    Validating: never;
    // PartiallyPaid: never;
  }
}

/**
 * Define new "Validating" and "PartiallyPaid" Payment states, with transitions to support partial payment flows.
 */
export const customPaymentProcess: PaymentProcess<"Validating"> = {
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
