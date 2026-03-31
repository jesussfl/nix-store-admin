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
exports.StorefrontNewsAdminResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const core_1 = require("@vendure/core");
const storefront_news_service_1 = require("../services/storefront-news.service");
let StorefrontNewsAdminResolver = class StorefrontNewsAdminResolver {
    constructor(storefrontNewsService) {
        this.storefrontNewsService = storefrontNewsService;
    }
    storefrontNewsItems(ctx, options) {
        return this.storefrontNewsService.findAll(ctx, options);
    }
    async getStorefrontNewsItem(ctx, newsId) {
        const newsItem = await this.storefrontNewsService.findOne(ctx, newsId);
        if (!newsItem) {
            throw new Error(`Storefront news item with ID ${newsId} not found`);
        }
        return newsItem;
    }
    createStorefrontNewsItem(ctx, input) {
        return this.storefrontNewsService.create(ctx, input);
    }
    updateStorefrontNewsItem(ctx, newsId, input) {
        return this.storefrontNewsService.update(ctx, newsId, input);
    }
    deleteStorefrontNewsItem(ctx, newsId) {
        return this.storefrontNewsService.delete(ctx, newsId);
    }
};
exports.StorefrontNewsAdminResolver = StorefrontNewsAdminResolver;
__decorate([
    (0, graphql_1.Query)(),
    (0, core_1.Allow)(core_1.Permission.ReadCatalog),
    __param(0, (0, core_1.Ctx)()),
    __param(1, (0, graphql_1.Args)("options", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], StorefrontNewsAdminResolver.prototype, "storefrontNewsItems", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, core_1.Allow)(core_1.Permission.ReadCatalog),
    __param(0, (0, core_1.Ctx)()),
    __param(1, (0, graphql_1.Args)("newsId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, String]),
    __metadata("design:returntype", Promise)
], StorefrontNewsAdminResolver.prototype, "getStorefrontNewsItem", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, core_1.Transaction)(),
    (0, core_1.Allow)(core_1.Permission.CreateCatalog),
    __param(0, (0, core_1.Ctx)()),
    __param(1, (0, graphql_1.Args)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], StorefrontNewsAdminResolver.prototype, "createStorefrontNewsItem", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, core_1.Transaction)(),
    (0, core_1.Allow)(core_1.Permission.UpdateCatalog),
    __param(0, (0, core_1.Ctx)()),
    __param(1, (0, graphql_1.Args)("newsId")),
    __param(2, (0, graphql_1.Args)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, String, Object]),
    __metadata("design:returntype", Promise)
], StorefrontNewsAdminResolver.prototype, "updateStorefrontNewsItem", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, core_1.Transaction)(),
    (0, core_1.Allow)(core_1.Permission.DeleteCatalog),
    __param(0, (0, core_1.Ctx)()),
    __param(1, (0, graphql_1.Args)("newsId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, String]),
    __metadata("design:returntype", Promise)
], StorefrontNewsAdminResolver.prototype, "deleteStorefrontNewsItem", null);
exports.StorefrontNewsAdminResolver = StorefrontNewsAdminResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [storefront_news_service_1.StorefrontNewsService])
], StorefrontNewsAdminResolver);
