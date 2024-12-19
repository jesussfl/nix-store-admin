"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPaymentResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const core_1 = require("@vendure/core");
let OrderPaymentResolver = class OrderPaymentResolver {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async addPaymentToExistingOrder(ctx, args) {
        // Find the order by ID and check if it’s eligible for additional payments
        const order = await this.orderService.findOneByCode(ctx, args.orderCode);
        if (!order) {
            throw new Error(`Order with ID ${args.orderCode} not found`);
        }
        core_1.Logger.info(`Order with ID ${args.orderCode} found`, "PartialPaymentResolver");
        core_1.Logger.info(`${order.id}`, "PartialPaymentResolver");
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
};
exports.OrderPaymentResolver = OrderPaymentResolver;
__decorate([
    (0, graphql_1.Mutation)(),
    (0, core_1.Transaction)(),
    __param(0, (0, core_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], OrderPaymentResolver.prototype, "addPaymentToExistingOrder", null);
exports.OrderPaymentResolver = OrderPaymentResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [core_1.OrderService])
], OrderPaymentResolver);
