import { compileUiExtensions, setBranding } from "@vendure/ui-devkit/compiler";
import * as path from "path";
import { LotesPlugin } from "./plugins/lotes-plugin/lote.plugin";
const IS_DEV = process.env.NODE_ENV === "development";
compileUiExtensions({
  outputPath: IS_DEV ? path.join(__dirname, "../admin-ui") : path.join(__dirname, "../dist/admin-ui"),
  devMode: IS_DEV ? true : false,
  command: "yarn",
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
})
  .compile?.()
  .then(() => {
    process.exit(0);
  });
