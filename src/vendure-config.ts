import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
  DefaultLogger,
  LogLevel,
  defaultShippingCalculator,
  LanguageCode,
} from "@vendure/core";
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from "@vendure/email-plugin";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import "dotenv/config";
import path from "path";
import { HardenPlugin } from "@vendure/harden-plugin";
import { ElasticsearchPlugin } from "@vendure/elasticsearch-plugin";
import { externalShippingCalculator } from "./shipping-methods/external-shipping-calculator";
import { compileUiExtensions, setBranding } from "@vendure/ui-devkit/compiler";
const IS_DEV = process.env.APP_ENV === "dev";
const serverPort = +process.env.PORT || 3000;
const serverHost = process.env.APP_HOST || "http://localhost";
export const config: VendureConfig = {
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
      // sameSite: "none",
      // secure: true,
      // httpOnly: true,
      // path: "http://172.16.0.49:3001",
      // domain: "http://172.16.0.49:3001",
      secret: process.env.COOKIE_SECRET,
    },
  },
  logger: new DefaultLogger({
    level: LogLevel.Debug,
  }),

  dbConnectionOptions: {
    type: "postgres",
    logger: "debug",
    // See the README.md "Migrations" section for an explanation of
    // the `synchronize` and `migrations` options.
    synchronize: process.env.DB_SYNCHRONIZE === "true",
    migrations: [path.join(__dirname, "./migrations/*.+(js|ts)")],
    logging: false,
    database: process.env.DB_NAME,
    schema: process.env.DB_SCHEMA,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  shippingOptions: {
    shippingCalculators: [defaultShippingCalculator, externalShippingCalculator],
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  // When adding or altering custom field definitions, the database will
  // need to be updated. See the "Migrations" section in README.md.
  customFields: {},
  plugins: [
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
    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir: process.env.ASSET_UPLOAD_DIR || path.join(__dirname, "../static/assets"),
      // For local dev, the correct value for assetUrlPrefix should
      // be guessed correctly, but for production it will usually need
      // to be set manually to match your production url.
      assetUrlPrefix: IS_DEV ? undefined : "https://nix-store-admin-production.up.railway.app/assets/",
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, "../static/email/test-emails"),
      route: "mailbox",
      handlers: defaultEmailHandlers,
      templateLoader: new FileBasedTemplateLoader(path.join(__dirname, "../static/email/templates")),
      globalTemplateVars: {
        // The following variables will change depending on your storefront implementation.
        // Here we are assuming a storefront running at http://localhost:8080.
        fromAddress: '"example" <noreply@example.com>',
        verifyEmailAddressUrl: "http://localhost:8080/verify",
        passwordResetUrl: "http://localhost:8080/password-reset",
        changeEmailAddressUrl: "http://localhost:8080/verify-email-address-change",
      },
    }),
    AdminUiPlugin.init({
      route: "admin",
      port: serverPort + 2,
      app: compileUiExtensions({
        // ngCompilerPath: path.join(__dirname, "./node_modules/.bin/ng"),
        outputPath: path.join(__dirname, "../admin-ui"),
        extensions: [
          setBranding({
            // The small logo appears in the top left of the screen
            smallLogoPath: path.join(__dirname, "../images/nix-logo-sm.png"),
            // The large logo is used on the login page
            largeLogoPath: path.join(__dirname, "../images/nix-logo.png"),
            faviconPath: path.join(__dirname, "../images/favicon.ico"),
          }),
          {
            translations: {
              es: path.join(__dirname, "translations/es.json"),
            },
          },
        ],
      }),
      // adminUiConfig: {
      //   brand: "Nix Store",
      //   // apiPort: serverPort + 2,
      //   // apiHost: serverHost,
      //   // hideVendureBranding: true,
      //   hideVersion: true,
      //   defaultLanguage: LanguageCode.en,
      //   availableLanguages: [LanguageCode.es, LanguageCode.en],
      // },
    }),
  ],
};
