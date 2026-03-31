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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_1 = require("@vendure/ui-devkit/compiler");
const path = __importStar(require("path"));
const lote_plugin_1 = require("./plugins/lotes-plugin/lote.plugin");
const news_plugin_1 = require("./plugins/news-plugin/news.plugin");
const IS_DEV = process.env.NODE_ENV === "development";
(_b = (_a = (0, compiler_1.compileUiExtensions)({
    outputPath: IS_DEV ? path.join(__dirname, "../admin-ui") : path.join(__dirname, "../dist/admin-ui"),
    devMode: IS_DEV ? true : false,
    //   ngCompilerPath: path.join(__dirname, "./node_modules/.bin/ng"),
    extensions: [
        lote_plugin_1.LotesPlugin.ui,
        news_plugin_1.NewsPlugin.ui,
        {
            staticAssets: [
                {
                    path: path.join(__dirname, "../images/nix-logo-sm.png"),
                    rename: "logo-top.webp",
                },
                {
                    path: path.join(__dirname, "../images/nix-logo.png"),
                    rename: "logo-login.webp",
                },
                path.join(__dirname, "../images/favicon.ico"),
            ],
        },
        {
            translations: {
                es: path.join(__dirname, "translations/es.json"),
            },
        },
    ],
})).compile) === null || _b === void 0 ? void 0 : _b.call(_a).then(() => {
    process.exit(0);
});
