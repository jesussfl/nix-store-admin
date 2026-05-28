"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsPlugin = void 0;
const core_1 = require("@vendure/core");
const api_extensions_1 = require("./api/api-extensions");
const news_admin_resolver_1 = require("./api/news-admin.resolver");
const news_shop_resolver_1 = require("./api/news-shop.resolver");
const storefront_news_entity_1 = require("./entities/storefront-news.entity");
const storefront_news_service_1 = require("./services/storefront-news.service");
let NewsPlugin = class NewsPlugin {
};
exports.NewsPlugin = NewsPlugin;
exports.NewsPlugin = NewsPlugin = __decorate([
    (0, core_1.VendurePlugin)({
        imports: [core_1.PluginCommonModule],
        entities: [storefront_news_entity_1.StorefrontNews],
        providers: [storefront_news_service_1.StorefrontNewsService],
        exports: [storefront_news_service_1.StorefrontNewsService],
        adminApiExtensions: {
            schema: api_extensions_1.adminApiExtensions,
            resolvers: [news_admin_resolver_1.StorefrontNewsAdminResolver],
        },
        shopApiExtensions: {
            schema: api_extensions_1.shopApiExtensions,
            resolvers: [news_shop_resolver_1.StorefrontNewsShopResolver],
        },
        dashboard: "./dashboard/index.tsx",
    })
], NewsPlugin);
