import { LanguageCode, PaymentMethodHandler, SettlePaymentResult, SettlePaymentErrorResult } from "@vendure/core";
import { Logger } from "@vendure/core";

const loggerCtx = "PartialPaymentHandler";

export const partialPaymentHandler = new PaymentMethodHandler({
  code: "partial-payment",
  description: [{ languageCode: LanguageCode.en, value: "Partial Payment" }],
  args: {
    initialPercentage: { type: "int", defaultValue: 50 }, // could also be 60, 70, etc.
  },

  // Create initial partial payment
  createPayment: async (ctx, order, amount, args, metadata) => {
    const initialAmount = (order.total * args.initialPercentage) / 100;
    Logger.info(`monto: ${metadata.monto}`, loggerCtx);
    if (metadata.monto < initialAmount / 100) {
      throw new Error(`Total paid must be at least ${initialAmount / 100}`);
    }

    Logger.info(`Initial partial payment of ${initialAmount} created`, loggerCtx);

    return {
      amount: metadata.monto,
      state: "Validating",
      transactionId: metadata.referencia || metadata.email,
      metadata: { ...metadata, initialPercentage: args.initialPercentage },
    };
  },

  // Settle remaining payment when the order is in PartiallyPaid state
  settlePayment: async (ctx, order, payment, args, metadata): Promise<SettlePaymentResult | SettlePaymentErrorResult> => {
    const remainingAmount = order.total - payment.amount;

    if (remainingAmount <= 0) {
      return {
        success: false,
        errorMessage: `No remaining amount due or invalid payment amount. Remaining amount: ${remainingAmount}`,
      };
    }
    return { success: true };
  },
});
