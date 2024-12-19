"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const compiler_1 = require("@vendure/ui-devkit/compiler");
const core_1 = require("@vendure/core");
const email_plugin_1 = require("@vendure/email-plugin");
const asset_server_plugin_1 = require("@vendure/asset-server-plugin");
const admin_ui_plugin_1 = require("@vendure/admin-ui-plugin");
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const external_shipping_calculator_1 = require("./shipping-methods/external-shipping-calculator");
const partial_payment_handler_1 = require("./plugins/partial-payment/partial-payment-handler");
const order_process_1 = require("./plugins/partial-payment/order-process");
const order_placed_strategy_1 = require("./plugins/partial-payment/order-placed-strategy");
const payment_process_1 = require("./plugins/partial-payment/payment-process");
const partial_payment_plugin_1 = require("./plugins/partial-payment/partial-payment.plugin");
const lote_plugin_1 = require("./plugins/lotes-plugin/lote.plugin");
// import { NationalShippingPlugin } from "./plugins/national-shipping/national-shipping.plugin";
const IS_DEV = process.env.APP_ENV === "dev";
const serverPort = +process.env.PORT || 3000;
const serverHost = process.env.APP_HOST || "http://localhost";
exports.config = {
    apiOptions: {
        // hostname: serverHost,
        // hostname: serverHost,
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
        migrations: [path_1.default.join(__dirname, "./migrations/*.+(js|ts)")],
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
        // NationalShippingPlugin,
        // HardenPlugin.init({
        //   maxQueryComplexity: 650,
        //   apiMode: IS_DEV ? "dev" : "prod",
        // }),
        // ElasticsearchPlugin.init({
        //   host: "https://nix-store-admin.onrender.com",
        //   port: 9200,
        //   indexSettings: {
        //     index: {
        //       max_result_window: 50000,
        //     },
        //     analysis: {
        //       analyzer: {
        //         custom_autocomplete_analyzer: {
        //           tokenizer: "standard",
        //           filter: ["lowercase", "ngram", "english_stop", "english_stemmer"],
        //         },
        //         custom_search_analyzer: {
        //           tokenizer: "standard",
        //           filter: ["lowercase", "english_stemmer"],
        //         },
        //       },
        //       filter: {
        //         ngram: {
        //           type: "edge_ngram",
        //           min_gram: 2,
        //           max_gram: 12,
        //         },
        //         english_stop: {
        //           type: "stop",
        //           stopwords: "_english_", // Change to English stopwords
        //         },
        //         english_stemmer: {
        //           type: "stemmer",
        //           language: "english", // Change to English stemmer
        //         },
        //       },
        //     },
        //   },
        //   indexMappingProperties: {
        //     productName: {
        //       type: "text",
        //       analyzer: "custom_autocomplete_analyzer",
        //       search_analyzer: "custom_search_analyzer",
        //       fields: {
        //         keyword: {
        //           type: "keyword",
        //           ignore_above: 256,
        //         },
        //       },
        //     },
        //     productVariantName: {
        //       type: "text",
        //       analyzer: "custom_autocomplete_analyzer",
        //       search_analyzer: "custom_search_analyzer",
        //       fields: {
        //         keyword: {
        //           type: "keyword",
        //           ignore_above: 256,
        //         },
        //       },
        //     },
        //     sku: {
        //       type: "text",
        //       analyzer: "custom_autocomplete_analyzer",
        //       search_analyzer: "custom_search_analyzer",
        //       fields: {
        //         keyword: {
        //           type: "keyword",
        //           ignore_above: 256,
        //         },
        //       },
        //     },
        //     description: {
        //       type: "text",
        //       analyzer: "custom_autocomplete_analyzer",
        //       search_analyzer: "custom_search_analyzer",
        //       fields: {
        //         keyword: {
        //           type: "keyword",
        //           ignore_above: 256,
        //         },
        //       },
        //     },
        //   },
        // }),
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
            app: (0, compiler_1.compileUiExtensions)({
                outputPath: path_1.default.join(__dirname, "../admin-ui"),
                devMode: IS_DEV ? true : false,
                // command: "yarn",
                // ngCompilerPath: path.join(__dirname, "./node_modules/.bin/ng"),
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
            adminUiConfig: {
                // apiPort: serverPort,
                brand: "Nix Store",
                // hideVendureBranding: true,
                hideVersion: true,
                defaultLanguage: core_1.LanguageCode.en,
                availableLanguages: [core_1.LanguageCode.es, core_1.LanguageCode.en],
            },
        }),
    ],
};
