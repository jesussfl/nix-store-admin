"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsPlugin = void 0;
const core_1 = require("@vendure/core");
const path = __importStar(require("path"));
const api_extensions_1 = require("./api/api-extensions");
const news_admin_resolver_1 = require("./api/news-admin.resolver");
const news_shop_resolver_1 = require("./api/news-shop.resolver");
const storefront_news_entity_1 = require("./entities/storefront-news.entity");
const storefront_news_service_1 = require("./services/storefront-news.service");
let NewsPlugin = class NewsPlugin {
};
exports.NewsPlugin = NewsPlugin;
NewsPlugin.ui = {
    id: "storefront-news-ui",
    extensionPath: path.join(__dirname, "ui"),
    routes: [{ route: "storefront-news", filePath: "routes.ts" }],
    providers: ["providers.ts"],
};
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
    })
], NewsPlugin);
