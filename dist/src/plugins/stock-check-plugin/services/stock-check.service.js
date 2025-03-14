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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockCheckService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@vendure/core");
let StockCheckService = class StockCheckService {
    constructor(connection, productVariantService, stockMovementService) {
        this.connection = connection;
        this.productVariantService = productVariantService;
        this.stockMovementService = stockMovementService;
    }
    /**
     * Gets the current stock level for a product variant
     */
    async getCurrentStockLevel(ctx, variantId) {
        try {
            // Obtenemos el ProductVariant
            const variant = await this.productVariantService.findOne(ctx, variantId);
            if (!variant) {
                throw new Error(`Product variant with ID ${variantId} not found`);
            }
            // En Vendure, podemos obtener el nivel de stock actual así:
            // Si el sistema usa multiple stock locations, obtenemos la suma total
            const stockLevel = await this.connection
                .getRepository(ctx, "StockLevel")
                .createQueryBuilder("stockLevel")
                .where("stockLevel.productVariantId = :variantId", { variantId })
                .select("SUM(stockLevel.stockOnHand)", "stockOnHand")
                .getRawOne();
            return (stockLevel === null || stockLevel === void 0 ? void 0 : stockLevel.stockOnHand) || 0;
        }
        catch (error) {
            console.error(`Error getting stock level for variant ${variantId}:`, error);
            return 0;
        }
    }
};
exports.StockCheckService = StockCheckService;
exports.StockCheckService = StockCheckService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.TransactionalConnection,
        core_1.ProductVariantService,
        core_1.StockMovementService])
], StockCheckService);
