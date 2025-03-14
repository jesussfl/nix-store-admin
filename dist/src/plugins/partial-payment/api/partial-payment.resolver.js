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
            core_1.Logger.info(`Payment added successfully: ${newPaymentDecimal} (${newPaymentInSubunits} subunits)`, "OrderPaymentResolver");
            return paymentResult;
        }
        catch (error) {
            core_1.Logger.error(`Error adding payment: ${error.message}`, "OrderPaymentResolver");
            throw new Error(`Error al agregar el pago: ${error.message}`);
        }
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
