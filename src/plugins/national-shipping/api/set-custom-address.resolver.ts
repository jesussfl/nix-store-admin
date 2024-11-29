import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Ctx, RequestContext, Transaction, OrderService, Logger } from "@vendure/core";
import { MutationSetOrderShippingAddressArgs } from "@vendure/common/lib/generated-shop-types";
@Resolver()
export class NationalShippingResolver {
  constructor(private orderService: OrderService) {}

  @Mutation()
  @Transaction()
  async setCustomAddressToOrder(@Ctx() ctx: RequestContext, @Args() args: { input: MutationSetOrderShippingAddressArgs; orderCode: string; metadata: any }) {
    // Find the order by ID and check if it’s eligible for additional payments
    const order = await this.orderService.findOneByCode(ctx, args.orderCode);
    if (!order) {
      throw new Error(`Order with ID ${args.orderCode} not found`);
    }

    Logger.info(`Order with ID ${args.orderCode} found`, "PartialPaymentResolver");
    Logger.info(`${order.id}`, "PartialPaymentResolver");

    // Calculate the remaining amount and validate the payment input
    const remainingAmount = order.totalWithTax - args.metadata.totalPaid;
    if (args.metadata.totalPaid < remainingAmount) {
      throw new Error(`Payment amount is less than remaining balance. Remaining balance: ${remainingAmount}`);
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
