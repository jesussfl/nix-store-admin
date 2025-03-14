"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockCheckPlugin = void 0;
const core_1 = require("@vendure/core");
const api_extensions_1 = require("./api/api-extensions");
const stock_check_resolver_1 = require("./api/stock-check.resolver");
const stock_check_service_1 = require("./services/stock-check.service");
/**
 * Plugin para verificar y exponer información sobre el nivel de stock de los productos
 */
let StockCheckPlugin = class StockCheckPlugin {
};
exports.StockCheckPlugin = StockCheckPlugin;
exports.StockCheckPlugin = StockCheckPlugin = __decorate([
    (0, core_1.VendurePlugin)({
        imports: [core_1.PluginCommonModule],
        providers: [stock_check_service_1.StockCheckService],
        shopApiExtensions: {
            schema: api_extensions_1.shopApiExtensions,
            resolvers: [stock_check_resolver_1.StockCheckShopResolver],
        },
    })
], StockCheckPlugin);
