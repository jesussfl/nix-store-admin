import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
  DefaultLogger,
  LogLevel,
  defaultShippingCalculator,
  LanguageCode,
  defaultOrderProcess,
  defaultPaymentProcess,
} from "@vendure/core";
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from "@vendure/email-plugin";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import path from "path";
import { externalShippingCalculator } from "./shipping-methods/external-shipping-calculator";
import { partialPaymentHandler } from "./plugins/partial-payment/partial-payment-handler";
import { customOrderProcess } from "./plugins/partial-payment/order-process";
import { MyOrderPlacedStrategy } from "./plugins/partial-payment/order-placed-strategy";
import { customPaymentProcess } from "./plugins/partial-payment/payment-process";
import { PartialPaymentPlugin } from "./plugins/partial-payment/partial-payment.plugin";
import { LotesPlugin } from "./plugins/lotes-plugin/lote.plugin";
import { Lote } from "./plugins/lotes-plugin/entities/lote.entity";
import { StockCheckPlugin } from "./plugins/stock-check-plugin/stock-check.plugin";
import { NewsPlugin } from "./plugins/news-plugin/news.plugin";
// import { NationalShippingPlugin } from "./plugins/national-shipping/national-shipping.plugin";
import "./config";

const IS_DEV = process.env.NODE_ENV === "development";
const serverPort = +process.env.PORT || 3000;
const appHost = (process.env.APP_HOST || `http://localhost:${serverPort}`).replace(/\/$/, "");
const dbSslEnabled = process.env.DB_SSL?.toLowerCase() === "true" || !IS_DEV;

export const config: VendureConfig = {
  apiOptions: {
    port: +(process.env.PORT || 3000),
    adminApiPath: "admin-api",
    shopApiPath: "shop-api",
    cors: {
      origin: [
        // Production frontend
        "https://www.nixstoreve.com",
        "https://nixstoreve.com",
        // Local development
        "http://localhost:3001",
        "http://localhost:3000",
      ],
      credentials: true,
    },
    // The following options are useful in development mode,
    // but are best turned off for production for security reasons.
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
    ...(dbSslEnabled
      ? {
          ssl: {
            rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED?.toLowerCase() === "true",
          },
        }
      : {}),
  },

  shippingOptions: {
    shippingCalculators: [defaultShippingCalculator, externalShippingCalculator],
  },

  orderOptions: {
    process: [defaultOrderProcess, customOrderProcess],
    orderPlacedStrategy: new MyOrderPlacedStrategy(),
  },

  paymentOptions: {
    process: [defaultPaymentProcess, customPaymentProcess],
    paymentMethodHandlers: [dummyPaymentHandler, partialPaymentHandler],
  },

  // When adding or altering custom field definitions, the database will
  // need to be updated. See the "Migrations" section in README.md.
  customFields: {
    Order: [
      {
        name: "lote",
        type: "relation",
        entity: Lote,
        public: true,
      },
    ],
    OrderLine: [
      {
        name: "shippingType",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "Shipping type" },
          { languageCode: LanguageCode.es, value: "Tipo de envío" },
        ],
      },
    ],
    Address: [
      {
        name: "officeCode",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "Office code" },
          { languageCode: LanguageCode.es, value: "Código de oficina" },
        ],
      },
      {
        name: "shippingCompany",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "Shipping company" },
          { languageCode: LanguageCode.es, value: "Compañía de envío" },
        ],
      },
      {
        name: "shippingDescription",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "Shipping description" },
          { languageCode: LanguageCode.es, value: "Descripción de envío" },
        ],
      },
    ],
  },

  plugins: [
    PartialPaymentPlugin,
    LotesPlugin,
    StockCheckPlugin,
    NewsPlugin,

    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir: process.env.ASSET_UPLOAD_DIR || path.join(__dirname, "../static/assets"),
      assetUrlPrefix: IS_DEV ? undefined : `${appHost}/assets/`,
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init(
      IS_DEV
        ? {
            devMode: true,
            outputPath: path.join(__dirname, "../static/email/test-emails"),
            route: "mailbox",
            handlers: defaultEmailHandlers,
            templateLoader: new FileBasedTemplateLoader(path.join(__dirname, "../static/email/templates")),
            globalTemplateVars: {
              fromAddress: '"example" <noreply@example.com>',
              verifyEmailAddressUrl: `${appHost}/verify`,
              passwordResetUrl: `${appHost}/password-reset`,
              changeEmailAddressUrl: `${appHost}/verify-email-address-change`,
            },
          }
        : {
            transport: {
              type: "none",
            },
            handlers: defaultEmailHandlers,
            templateLoader: new FileBasedTemplateLoader(path.join(__dirname, "../static/email/templates")),
            globalTemplateVars: {
              fromAddress: '"example" <noreply@example.com>',
              verifyEmailAddressUrl: `${appHost}/verify`,
              passwordResetUrl: `${appHost}/password-reset`,
              changeEmailAddressUrl: `${appHost}/verify-email-address-change`,
            },
          }
    ),
    AdminUiPlugin.init({
      route: "admin",
      port: serverPort + 2,
      ...(IS_DEV ? { hostname: "127.0.0.1" } : {}),
      app: compileAdminUi(),
      adminUiConfig: {
        ...(IS_DEV ? { apiPort: serverPort } : {}),
        brand: "Nix Store",
        hideVendureBranding: true,
        hideVersion: true,
        defaultLanguage: LanguageCode.es,
        availableLanguages: [LanguageCode.es, LanguageCode.en],
      },
    }),
  ],
};

function compileAdminUi() {
  if (!IS_DEV) {
    return {
      path: path.join(__dirname, "../admin-ui/dist/browser"),
    };
  }
  const { compileUiExtensions } = require("@vendure/ui-devkit/compiler") as typeof import("@vendure/ui-devkit/compiler");
  return {
    ...compileUiExtensions({
      outputPath: IS_DEV ? path.join(__dirname, "../admin-ui") : path.join(__dirname, "../dist/admin-ui"),
      devMode: IS_DEV ? true : false,
      watchPort: 4200,
      additionalProcessArguments: IS_DEV ? [["--host", "0.0.0.0"]] : undefined,
      //   ngCompilerPath: path.join(__dirname, "./node_modules/.bin/ng"),
      extensions: [
        LotesPlugin.ui,
        NewsPlugin.ui,
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
            // Keep the original filename to avoid copying the file onto itself in dev mode.
            path.join(__dirname, "../images/favicon.ico"),
          ],
        },
        {
          translations: {
            es: path.join(__dirname, "translations/es.json"),
          },
        },
      ],
    }),
  };
}
