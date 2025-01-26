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
import "dotenv/config";
import path from "path";
import { externalShippingCalculator } from "./shipping-methods/external-shipping-calculator";
import { partialPaymentHandler } from "./plugins/partial-payment/partial-payment-handler";
import { customOrderProcess } from "./plugins/partial-payment/order-process";
import { MyOrderPlacedStrategy } from "./plugins/partial-payment/order-placed-strategy";
import { customPaymentProcess } from "./plugins/partial-payment/payment-process";
import { PartialPaymentPlugin } from "./plugins/partial-payment/partial-payment.plugin";
import { LotesPlugin } from "./plugins/lotes-plugin/lote.plugin";
import { Lote } from "./plugins/lotes-plugin/entities/lote.entity";
import { compileUiExtensions, setBranding } from "@vendure/ui-devkit/compiler";
// import { NationalShippingPlugin } from "./plugins/national-shipping/national-shipping.plugin";
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
    migrations: [path.join(__dirname, "./src/migrations/*.+(js|ts)")],
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
          { languageCode: LanguageCode.es, value: "Código de oficina" },
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
        outputPath: path.join(__dirname, "../admin-ui"),
        devMode: IS_DEV ? true : false,
        // command: "yarn",
        //   ngCompilerPath: path.join(__dirname, "./node_modules/.bin/ng"),
        extensions: [
          LotesPlugin.ui,
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
      adminUiConfig: {
        apiPort: serverPort,
        brand: "Nix Store",
        // hideVendureBranding: true,

        hideVersion: true,
        defaultLanguage: LanguageCode.en,
        availableLanguages: [LanguageCode.es, LanguageCode.en],
      },
    }),
  ],
};
