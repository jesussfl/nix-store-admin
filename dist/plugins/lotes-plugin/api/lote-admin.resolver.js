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
exports.LoteAdminResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const core_1 = require("@vendure/core");
const lote_service_1 = require("../services/lote.service");
let LoteAdminResolver = class LoteAdminResolver {
    constructor(loteService) {
        this.loteService = loteService;
    }
    /**
     * Retrieves all Lotes.
     */
    async allLotes(ctx, args) {
        return this.loteService.findAll(ctx, args.options || undefined);
    }
    /**
     * Creates a new Lote.
     */
    async createLote(ctx, input) {
        return this.loteService.create(ctx, input.name, input.description);
    }
    /**
     * Updates an existing Lote.
     */
    async updateLote(ctx, loteId, input) {
        return this.loteService.update(ctx, loteId, input.name, input.description);
    }
    /**
     * Deletes a Lote by its ID.
     */
    async deleteLote(ctx, loteId) {
        return this.loteService.delete(ctx, loteId);
    }
};
exports.LoteAdminResolver = LoteAdminResolver;
__decorate([
    (0, graphql_1.Query)(),
    (0, core_1.Allow)(core_1.Permission.ReadCatalog) // Replace with appropriate permissions
    ,
    __param(0, (0, core_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], LoteAdminResolver.prototype, "allLotes", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, core_1.Transaction)(),
    (0, core_1.Allow)(core_1.Permission.CreateCatalog) // Replace with appropriate permissions
    ,
    __param(0, (0, core_1.Ctx)()),
    __param(1, (0, graphql_1.Args)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], LoteAdminResolver.prototype, "createLote", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, core_1.Transaction)(),
    (0, core_1.Allow)(core_1.Permission.UpdateCatalog) // Replace with appropriate permissions
    ,
    __param(0, (0, core_1.Ctx)()),
    __param(1, (0, graphql_1.Args)("loteId")),
    __param(2, (0, graphql_1.Args)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, String, Object]),
    __metadata("design:returntype", Promise)
], LoteAdminResolver.prototype, "updateLote", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, core_1.Transaction)(),
    (0, core_1.Allow)(core_1.Permission.DeleteCatalog) // Replace with appropriate permissions
    ,
    __param(0, (0, core_1.Ctx)()),
    __param(1, (0, graphql_1.Args)("loteId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, String]),
    __metadata("design:returntype", Promise)
], LoteAdminResolver.prototype, "deleteLote", null);
exports.LoteAdminResolver = LoteAdminResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [lote_service_1.LoteService])
], LoteAdminResolver);
