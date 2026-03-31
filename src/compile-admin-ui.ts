import { compileUiExtensions } from "@vendure/ui-devkit/compiler";
import * as path from "path";
import { LotesPlugin } from "./plugins/lotes-plugin/lote.plugin";
import { NewsPlugin } from "./plugins/news-plugin/news.plugin";
const IS_DEV = process.env.NODE_ENV === "development";
compileUiExtensions({
  outputPath: IS_DEV ? path.join(__dirname, "../admin-ui") : path.join(__dirname, "../dist/admin-ui"),
  devMode: IS_DEV ? true : false,
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
        path.join(__dirname, "../images/favicon.ico"),
      ],
    },
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
