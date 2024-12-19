"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialPaymentHandler = void 0;
const core_1 = require("@vendure/core");
const core_2 = require("@vendure/core");
const loggerCtx = "PartialPaymentHandler";
exports.partialPaymentHandler = new core_1.PaymentMethodHandler({
    code: "partial-payment",
    description: [{ languageCode: core_1.LanguageCode.en, value: "Partial Payment" }],
    args: {
        initialPercentage: { type: "int", defaultValue: 50 }, // could also be 60, 70, etc.
    },
    // Create initial partial payment
    createPayment: async (ctx, order, amount, args, metadata) => {
        const initialAmount = (order.total * args.initialPercentage) / 100;
        core_2.Logger.info(`monto: ${metadata.monto}`, loggerCtx);
        if (metadata.monto < initialAmount / 100) {
            throw new Error(`El monto debe ser mayor o igual a ${initialAmount / 100} (50% del total)`);
        }
        if (metadata.monto > order.total / 100) {
            throw new Error(`El monto debe ser menor o igual al total del pedido`);
        }
        core_2.Logger.info(`Initial partial payment of ${initialAmount} created`, loggerCtx);
        return {
            amount: metadata.monto,
            state: "Validating",
            transactionId: metadata.referencia || metadata.email,
            metadata: { ...metadata, initialPercentage: args.initialPercentage },
        };
    },
    // Settle remaining payment when the order is in PartiallyPaid state
    settlePayment: async (ctx, order, payment, args, metadata) => {
        const remainingAmount = order.total - payment.amount;
        if (remainingAmount <= 0) {
            return {
                success: false,
                errorMessage: `Ningún importe pendiente de pago o importe de pago no válido. Importe restante: ${remainingAmount}`,
            };
        }
        return { success: true };
    },
});
