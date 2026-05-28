import { vendureDashboardPlugin } from "@vendure/dashboard/vite";
import { join, resolve } from "path";
import { pathToFileURL } from "url";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/dashboard",
  build: {
    outDir: join(__dirname, "dist/dashboard"),
  },
  plugins: [
    vendureDashboardPlugin({
      vendureConfigPath: pathToFileURL("./src/vendure-config.ts"),
      api: {
        host: "http://localhost",
        port: Number(process.env.PORT ?? 3000),
      },
      gqlOutputPath: "./src/gql",
    }),
  ],
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "@tanstack/react-router",
      "@tanstack/react-store",
      "@tanstack/react-query",
    ],
    alias: {
      "@/gql": resolve(__dirname, "./src/gql/graphql.ts"),
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "@tanstack/react-router",
      "@tanstack/react-store",
      "@tanstack/react-query",
    ],
  },
});
