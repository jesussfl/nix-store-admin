import { generateMigration, revertLastMigration, runMigrations } from "@vendure/core";
import { Command } from "commander";

import { config } from "./src/vendure-config";

const program = new Command();

program
  .command("generate <name>")
  .description("Generate a new Vendure migration file")
  .action((name: string) => {
    return generateMigration(config, {
      name,
      outputDir: "./src/migrations",
    });
  });

program
  .command("run")
  .description("Run all pending Vendure migrations")
  .action(() => {
    return runMigrations(config);
  });

program
  .command("revert")
  .description("Revert the last applied Vendure migration")
  .action(() => {
    return revertLastMigration(config);
  });

program.parse(process.argv);
