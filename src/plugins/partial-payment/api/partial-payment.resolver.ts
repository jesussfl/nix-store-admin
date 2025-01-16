import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Allow, Ctx, Permission, RequestContext, Transaction, OrderService, Logger } from "@vendure/core";
import { Order } from "@vendure/core";

@Resolver()
export class OrderPaymentResolver {
  constructor(private orderService: OrderService) {}

  @Mutation()
  @Transaction()
  async addPaymentToExistingOrder(
    @Ctx() ctx: RequestContext,
    @Args()
    args: {
      orderCode: string;
      paymentMethodCode: string;
      metadata: any; // e.g. { monto, referencia, totalPaid, etc. }
    }
  ) {
    const order = await this.orderService.findOneByCode(ctx, args.orderCode, ["payments"]);
    if (!order) {
      throw new Error(`Order with code ${args.orderCode} not found`);
    }

    // 1) Extract new payment amount in decimal
    const newPaymentDecimal = Number(args.metadata.monto);
    console.log(`New payment amount: ${newPaymentDecimal}`);
    if (isNaN(newPaymentDecimal) || newPaymentDecimal <= 0) {
      throw new Error(`El monto debe ser un número válido mayor que 0.`);
    }

    // 2) Convert order total from subunits to decimal
    const orderTotalDecimal = order.total / 100;

    // 3) Sum up already-paid amounts in subunits and convert to decimal
    const totalPaidSoFarInSubunits = (order.payments || []).reduce((sum, p) => sum + p.amount, 0);
    const totalPaidSoFarDecimal = totalPaidSoFarInSubunits / 100;
    console.log(order.code, "Total paid so far:", totalPaidSoFarDecimal, order);
    // 4) If no prior payments, enforce 50% rule
    if (totalPaidSoFarDecimal === 0) {
      const halfOfTotalDecimal = orderTotalDecimal * 0.5;
      if (newPaymentDecimal < halfOfTotalDecimal) {
        throw new Error(`Debe pagar al menos 50% del total (>= ${halfOfTotalDecimal.toFixed(2)}).`);
      }
    }

    // 5) Allow overpayments (no check for exceeding total)

    // 6) Convert new payment from decimal back to subunits
    const newPaymentInSubunits = Math.round(newPaymentDecimal * 100);

    // 7) Update metadata to reflect subunit amount
    const updatedMetadata = {
      ...args.metadata,
      monto: newPaymentInSubunits, // Ensure 'monto' is in subunits for Vendure
    };

    // 8) Actually add the new payment to the order
    try {
      const paymentResult = await this.orderService.addPaymentToOrder(ctx, order.id, {
        method: args.paymentMethodCode,
        metadata: updatedMetadata,
      });

      Logger.info(`Payment added successfully: ${newPaymentDecimal} (${newPaymentInSubunits} subunits)`, "OrderPaymentResolver");

      return paymentResult;
    } catch (error: any) {
      Logger.error(`Error adding payment: ${error.message}`, "OrderPaymentResolver");
      throw new Error(`Error al agregar el pago: ${error.message}`);
    }
  }
}
