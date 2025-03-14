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
exports.StockCheckShopResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const core_1 = require("@vendure/core");
const stock_check_service_1 = require("../services/stock-check.service");
let StockCheckShopResolver = class StockCheckShopResolver {
    constructor(stockCheckService) {
        this.stockCheckService = stockCheckService;
    }
    /**
     * Get the current stock level for a product variant
     */
    async currentStockLevel(ctx, variantId) {
        return this.stockCheckService.getCurrentStockLevel(ctx, variantId);
    }
};
exports.StockCheckShopResolver = StockCheckShopResolver;
__decorate([
    (0, graphql_1.Query)(),
    (0, core_1.Allow)(core_1.Permission.Public) // Esta query es pública para que pueda ser accesible desde el storefront
    ,
    __param(0, (0, core_1.Ctx)()),
    __param(1, (0, graphql_1.Args)("variantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], StockCheckShopResolver.prototype, "currentStockLevel", null);
exports.StockCheckShopResolver = StockCheckShopResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [stock_check_service_1.StockCheckService])
], StockCheckShopResolver);
