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
exports.StorefrontNewsService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@vendure/core");
const storefront_news_entity_1 = require("../entities/storefront-news.entity");
let StorefrontNewsService = class StorefrontNewsService {
    constructor(connection, listQueryBuilder) {
        this.connection = connection;
        this.listQueryBuilder = listQueryBuilder;
    }
    findAll(ctx, options) {
        return this.listQueryBuilder
            .build(storefront_news_entity_1.StorefrontNews, options, { ctx, relations: ["imageAsset"] })
            .getManyAndCount()
            .then(([items, totalItems]) => ({ items, totalItems }));
    }
    findPublished(ctx) {
        return this.connection.getRepository(ctx, storefront_news_entity_1.StorefrontNews).find({
            where: { isPublished: true },
            relations: {
                imageAsset: true,
            },
            order: {
                sortOrder: "ASC",
                createdAt: "DESC",
            },
        });
    }
    findOne(ctx, newsId) {
        return this.connection.getRepository(ctx, storefront_news_entity_1.StorefrontNews).findOne({
            where: { id: newsId },
            relations: {
                imageAsset: true,
            },
        });
    }
    async create(ctx, input) {
        var _a, _b, _c, _d;
        const newsItem = this.connection.getRepository(ctx, storefront_news_entity_1.StorefrontNews).create({
            title: input.title,
            summary: input.summary,
            imageAsset: await this.getAsset(ctx, input.imageAssetId),
            ctaText: (_a = input.ctaText) !== null && _a !== void 0 ? _a : null,
            ctaLink: (_b = input.ctaLink) !== null && _b !== void 0 ? _b : null,
            sortOrder: (_c = input.sortOrder) !== null && _c !== void 0 ? _c : 0,
            isPublished: (_d = input.isPublished) !== null && _d !== void 0 ? _d : true,
        });
        return this.connection.getRepository(ctx, storefront_news_entity_1.StorefrontNews).save(newsItem);
    }
    async update(ctx, newsId, input) {
        var _a, _b, _c, _d;
        const newsItem = await this.findOne(ctx, newsId);
        if (!newsItem) {
            throw new Error(`Storefront news item with ID ${newsId} not found`);
        }
        newsItem.title = input.title;
        newsItem.summary = input.summary;
        newsItem.imageAsset = await this.getAsset(ctx, input.imageAssetId);
        newsItem.ctaText = (_a = input.ctaText) !== null && _a !== void 0 ? _a : null;
        newsItem.ctaLink = (_b = input.ctaLink) !== null && _b !== void 0 ? _b : null;
        newsItem.sortOrder = (_c = input.sortOrder) !== null && _c !== void 0 ? _c : 0;
        newsItem.isPublished = (_d = input.isPublished) !== null && _d !== void 0 ? _d : true;
        return this.connection.getRepository(ctx, storefront_news_entity_1.StorefrontNews).save(newsItem);
    }
    async delete(ctx, newsId) {
        const newsItem = await this.findOne(ctx, newsId);
        if (!newsItem) {
            throw new Error(`Storefront news item with ID ${newsId} not found`);
        }
        await this.connection.getRepository(ctx, storefront_news_entity_1.StorefrontNews).remove(newsItem);
        return true;
    }
    async getAsset(ctx, assetId) {
        if (!assetId) {
            return null;
        }
        return this.connection.getRepository(ctx, core_1.Asset).findOne({
            where: { id: assetId },
        });
    }
};
exports.StorefrontNewsService = StorefrontNewsService;
exports.StorefrontNewsService = StorefrontNewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.TransactionalConnection,
        core_1.ListQueryBuilder])
], StorefrontNewsService);
