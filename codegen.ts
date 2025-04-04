import type { CodegenConfig } from "@graphql-codegen/cli";

const schemaUrl = process.env.GRAPHQL_SCHEMA_URL || "https://nix-store-admin-production.up.railway.app/admin-api";

const config: CodegenConfig = {
  overwrite: true,
  schema: schemaUrl,
  // schema: "http://localhost:3000/admin-api",
  config: {
    scalars: { Money: "number" },
    namingConvention: { enumValues: "keep" },
  },
  generates: {
    "src/plugins/lotes-plugin/ui/gql/": {
      preset: "client",
      documents: "src/plugins/lotes-plugin/ui/**/*.ts",
      // This disables the "fragment masking" feature. Fragment masking
      // can improve component isolation but introduces some additional
      // complexity that we will avoid for now.
      presetConfig: {
        fragmentMasking: false,
      },
    },
    "src/plugins/lotes-plugin/ui/gql/generated.ts": {
      plugins: ["typescript"],
    },
  },
};

export default config;
