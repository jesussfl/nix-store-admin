"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const core_1 = require("@vendure/core");
const email_plugin_1 = require("@vendure/email-plugin");
const asset_server_plugin_1 = require("@vendure/asset-server-plugin");
const admin_ui_plugin_1 = require("@vendure/admin-ui-plugin");
const path_1 = __importDefault(require("path"));
const external_shipping_calculator_1 = require("./shipping-methods/external-shipping-calculator");
const partial_payment_handler_1 = require("./plugins/partial-payment/partial-payment-handler");
const order_process_1 = require("./plugins/partial-payment/order-process");
const order_placed_strategy_1 = require("./plugins/partial-payment/order-placed-strategy");
const payment_process_1 = require("./plugins/partial-payment/payment-process");
const partial_payment_plugin_1 = require("./plugins/partial-payment/partial-payment.plugin");
const lote_plugin_1 = require("./plugins/lotes-plugin/lote.plugin");
const lote_entity_1 = require("./plugins/lotes-plugin/entities/lote.entity");
const compiler_1 = require("@vendure/ui-devkit/compiler");
const stock_check_plugin_1 = require("./plugins/stock-check-plugin/stock-check.plugin");
// import { NationalShippingPlugin } from "./plugins/national-shipping/national-shipping.plugin";
require("./config");
const IS_DEV = process.env.NODE_ENV === "development";
const serverPort = +process.env.PORT || 3000;
exports.config = {
    apiOptions: {
        port: +(process.env.PORT || 3000),
        adminApiPath: "admin-api",
        shopApiPath: "shop-api",
        // The following options are useful in development mode,
        // but are best turned off for production for security
        // reasons.
        ...(IS_DEV
            ? {
                adminApiPlayground: {
                    settings: { "request.credentials": "include" },
                },
                adminApiDebug: true,
                shopApiPlayground: {
                    settings: { "request.credentials": "include" },
                },
                shopApiDebug: true,
            }
            : {}),
    },
    authOptions: {
        tokenMethod: ["bearer", "cookie"],
        requireVerification: false,
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME,
            password: process.env.SUPERADMIN_PASSWORD,
        },
        cookieOptions: {
            secret: process.env.COOKIE_SECRET,
        },
    },
    logger: new core_1.DefaultLogger({
        level: core_1.LogLevel.Debug,
    }),
    dbConnectionOptions: {
        type: "postgres",
        logger: "debug",
        // See the README.md "Migrations" section for an explanation of
        // the `synchronize` and `migrations` options.
        synchronize: process.env.DB_SYNCHRONIZE === "true",
        migrations: [path_1.default.join(__dirname, "./src/migrations/*.+(js|ts)")],
        logging: false,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    },
    shippingOptions: {
        shippingCalculators: [core_1.defaultShippingCalculator, external_shipping_calculator_1.externalShippingCalculator],
    },
    orderOptions: {
        process: [core_1.defaultOrderProcess, order_process_1.customOrderProcess],
        orderPlacedStrategy: new order_placed_strategy_1.MyOrderPlacedStrategy(),
    },
    paymentOptions: {
        process: [core_1.defaultPaymentProcess, payment_process_1.customPaymentProcess],
        paymentMethodHandlers: [core_1.dummyPaymentHandler, partial_payment_handler_1.partialPaymentHandler],
    },
    // When adding or altering custom field definitions, the database will
    // need to be updated. See the "Migrations" section in README.md.
    customFields: {
        Order: [
            {
                name: "lote",
                type: "relation",
                entity: lote_entity_1.Lote,
                public: true,
            },
        ],
        OrderLine: [
            {
                name: "shippingType",
                type: "string",
                label: [
                    { languageCode: core_1.LanguageCode.en, value: "Shipping type" },
                    { languageCode: core_1.LanguageCode.es, value: "Tipo de envío" },
                ],
            },
        ],
        Address: [
            {
                name: "officeCode",
                type: "string",
                label: [
                    { languageCode: core_1.LanguageCode.en, value: "Office code" },
                    { languageCode: core_1.LanguageCode.es, value: "Código de oficina" },
                ],
            },
            {
                name: "shippingCompany",
                type: "string",
                label: [
                    { languageCode: core_1.LanguageCode.en, value: "Shipping company" },
                    { languageCode: core_1.LanguageCode.es, value: "Compañía de envío" },
                ],
            },
            {
                name: "shippingDescription",
                type: "string",
                label: [
                    { languageCode: core_1.LanguageCode.en, value: "Shipping description" },
                    { languageCode: core_1.LanguageCode.es, value: "Descripción de envío" },
                ],
            },
        ],
    },
    plugins: [
        partial_payment_plugin_1.PartialPaymentPlugin,
        lote_plugin_1.LotesPlugin,
        stock_check_plugin_1.StockCheckPlugin,
        asset_server_plugin_1.AssetServerPlugin.init({
            route: "assets",
            assetUploadDir: process.env.ASSET_UPLOAD_DIR || path_1.default.join(__dirname, "../static/assets"),
            // For local dev, the correct value for assetUrlPrefix should
            // be guessed correctly, but for production it will usually need
            // to be set manually to match your production url.
            assetUrlPrefix: IS_DEV ? undefined : "https://nix-store-admin-production.up.railway.app/assets/",
        }),
        core_1.DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        core_1.DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        email_plugin_1.EmailPlugin.init({
            devMode: true,
            outputPath: path_1.default.join(__dirname, "../static/email/test-emails"),
            route: "mailbox",
            handlers: email_plugin_1.defaultEmailHandlers,
            templateLoader: new email_plugin_1.FileBasedTemplateLoader(path_1.default.join(__dirname, "../static/email/templates")),
            globalTemplateVars: {
                // The following variables will change depending on your storefront implementation.
                // Here we are assuming a storefront running at http://localhost:8080.
                fromAddress: '"example" <noreply@example.com>',
                verifyEmailAddressUrl: "http://localhost:8080/verify",
                passwordResetUrl: "http://localhost:8080/password-reset",
                changeEmailAddressUrl: "http://localhost:8080/verify-email-address-change",
            },
        }),
        admin_ui_plugin_1.AdminUiPlugin.init({
            route: "admin",
            port: serverPort + 2,
            app: compileAdminUi(),
            adminUiConfig: {
                ...(IS_DEV ? { apiPort: serverPort } : {}),
                brand: "Nix Store",
                hideVendureBranding: true,
                hideVersion: true,
                defaultLanguage: core_1.LanguageCode.es,
                availableLanguages: [core_1.LanguageCode.es, core_1.LanguageCode.en],
            },
        }),
    ],
};
function compileAdminUi() {
    if (!IS_DEV) {
        return {
            path: path_1.default.join(__dirname, "../admin-ui/dist"),
        };
    }
    return {
        ...(0, compiler_1.compileUiExtensions)({
            outputPath: IS_DEV ? path_1.default.join(__dirname, "../admin-ui") : path_1.default.join(__dirname, "../dist/admin-ui"),
            devMode: IS_DEV ? true : false,
            //   ngCompilerPath: path.join(__dirname, "./node_modules/.bin/ng"),
            extensions: [
                lote_plugin_1.LotesPlugin.ui,
                (0, compiler_1.setBranding)({
                    // The small logo appears in the top left of the screen
                    smallLogoPath: path_1.default.join(__dirname, "../images/nix-logo-sm.png"),
                    // The large logo is used on the login page
                    largeLogoPath: path_1.default.join(__dirname, "../images/nix-logo.png"),
                    faviconPath: path_1.default.join(__dirname, "../images/favicon.ico"),
                }),
                {
                    translations: {
                        es: path_1.default.join(__dirname, "translations/es.json"),
                    },
                },
            ],
        }),
    };
}
