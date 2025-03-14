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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotesPlugin = void 0;
const core_1 = require("@vendure/core");
const path = __importStar(require("path"));
const api_extensions_1 = require("./api/api-extensions");
const lote_admin_resolver_1 = require("./api/lote-admin.resolver");
const lote_entity_1 = require("./entities/lote.entity");
const lote_service_1 = require("./services/lote.service");
let LotesPlugin = class LotesPlugin {
};
exports.LotesPlugin = LotesPlugin;
LotesPlugin.ui = {
    id: "lotes-ui",
    extensionPath: path.join(__dirname, "ui"),
    routes: [{ route: "lotes", filePath: "routes.ts" }],
    providers: ["providers.ts"],
};
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
    })
], LotesPlugin);
