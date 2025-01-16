import { LanguageCode, PaymentMethodHandler, SettlePaymentResult, SettlePaymentErrorResult, Logger } from "@vendure/core";

const loggerCtx = "PartialPaymentHandler";

export const partialPaymentHandler = new PaymentMethodHandler({
  code: "partial-payment",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Partial Payment",
    },
  ],
  args: {
    initialPercentage: {
      type: "int",
      defaultValue: 50, // 50% by default
    },
  },

  // Called whenever a new partial payment is created
  createPayment: async (ctx, order, amount, args, metadata) => {
    // 1) Convert the order total from subunits to decimal
    const orderTotalDecimal = order.total / 100;

    // 2) Sum up already-paid amounts in subunits and convert to decimal
    const totalPaidSoFarInSubunits = (order.payments || []).reduce((sum, p) => sum + p.amount, 0);
    const totalPaidSoFarDecimal = totalPaidSoFarInSubunits / 100;

    // 3) metadata.monto is presumably typed in decimal (like "20" = 20.00)
    const newPaymentDecimal = Number(metadata.monto);
    if (isNaN(newPaymentDecimal) || newPaymentDecimal <= 0) {
      throw new Error(`El monto debe ser un número válido mayor que 0.`);
    }

    // 4) If this is the FIRST payment, enforce the 50% rule in decimal
    if (totalPaidSoFarDecimal === 0) {
      const halfOfTotalDecimal = orderTotalDecimal * (args.initialPercentage / 100);
      if (newPaymentDecimal < halfOfTotalDecimal) {
        throw new Error(`El monto debe ser >= ${args.initialPercentage}% del total (>= ${halfOfTotalDecimal.toFixed(2)}).`);
      }
    }

    // 5) No check if they exceed the total. Users can overpay.

    Logger.info(`Accepting partial payment of ${newPaymentDecimal}. Already paid: ${totalPaidSoFarDecimal}, order total: ${orderTotalDecimal}`, loggerCtx);

    // 6) Convert the new payment from decimal back to subunits for Vendure:
    const newPaymentInSubunits = Math.round(newPaymentDecimal * 100);

    // 7) Return the Payment object in Vendure’s expected format
    return {
      amount: newPaymentInSubunits,
      state: "Validating",
      transactionId: metadata.referencia || "", // or other unique ID
      metadata: {
        ...metadata,
        initialPercentage: args.initialPercentage,
      },
    };
  },

  // Called when Vendure tries to settle the payment
  settlePayment: async (ctx, order, payment, args, metadata): Promise<SettlePaymentResult | SettlePaymentErrorResult> => {
    // Calculate total paid so far in subunits

    // console.log("Settling payment", payment, order);

    // const totalPaidSoFar = (order.payments || []).reduce((sum, p) => sum + p.amount, 0);

    // // Option A: If you ONLY want to settle once fully paid:
    // if (totalPaidSoFar < order.total) {
    //   return {
    //     success: false,
    //     errorMessage: `Aún hay un monto pendiente: ${(order.total - totalPaidSoFar) / 100}.`,
    //   };
    // } else {
    //   // All paid (or overpaid)
    // }
    return { success: true };
  },
});
