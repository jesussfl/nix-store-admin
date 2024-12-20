import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Allow, Ctx, Permission, RequestContext, Transaction, OrderService, Logger } from "@vendure/core";
import { Order } from "@vendure/core";

@Resolver()
export class OrderPaymentResolver {
  constructor(private orderService: OrderService) {}

  @Mutation()
  @Transaction()
  async addPaymentToExistingOrder(@Ctx() ctx: RequestContext, @Args() args: { orderCode: string; paymentMethodCode: string; metadata: any }) {
    // Find the order by ID and check if it’s eligible for additional payments
    const order = await this.orderService.findOneByCode(ctx, args.orderCode);
    if (!order) {
      throw new Error(`Order with ID ${args.orderCode} not found`);
    }

    Logger.info(`Order with ID ${args.orderCode} found`, "PartialPaymentResolver");
    Logger.info(`${order.id}`, "PartialPaymentResolver");

    const remainingAmount = order.totalWithTax - args.metadata.totalPaid;
    if (args.metadata.totalPaid < remainingAmount) {
      throw new Error(`Payment amount is less than remaining balance. Remaining balance: ${remainingAmount}`);
    }

    const is50PercentPaid = args.metadata.totalPaid >= (order.totalWithTax * 50) / 100;

    if (!is50PercentPaid) {
      throw new Error(`Payment amount is less than 50% of the total.`);
    }

    // Add the new payment to the order
    return this.orderService.addPaymentToOrder(ctx, order.id, {
      method: args.paymentMethodCode,
      metadata: args.metadata,
    });

    // If the payment completes the total, transition the order to 'PaymentSettled'
    // if (totalPaid >= order.totalWithTax) {
    //   await this.orderService.transitionToState(ctx, order.id, "PaymentSettled");
    // }

    // return paymentResult;
  }
}
