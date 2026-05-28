"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotesPlugin = void 0;
const core_1 = require("@vendure/core");
const api_extensions_1 = require("./api/api-extensions");
const lote_admin_resolver_1 = require("./api/lote-admin.resolver");
const lote_entity_1 = require("./entities/lote.entity");
const lote_service_1 = require("./services/lote.service");
let LotesPlugin = class LotesPlugin {
};
exports.LotesPlugin = LotesPlugin;
exports.LotesPlugin = LotesPlugin = __decorate([
    (0, core_1.VendurePlugin)({
        imports: [core_1.PluginCommonModule],
        exports: [lote_service_1.LoteService],
        entities: [lote_entity_1.Lote],
        providers: [lote_service_1.LoteService],
        adminApiExtensions: {
            schema: api_extensions_1.adminApiExtensions,
            resolvers: [lote_admin_resolver_1.LoteAdminResolver],
        },
        shopApiExtensions: {
            schema: api_extensions_1.apiExtensions,
            resolvers: [],
        },
        dashboard: "./dashboard/index.tsx",
    })
], LotesPlugin);
