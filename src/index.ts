import { bootstrap, JobQueueService, runMigrations } from "@vendure/core";
import "./config";
import { config } from "./vendure-config";
import { populateOnFirstRun } from "./populate";
import fs from "fs";
import path from "path";

// Mostrar mensaje informativo sobre el entorno actual
console.log(`Running server in ${process.env.NODE_ENV} mode`);
const shouldRunMigrations = process.env.DB_SYNCHRONIZE !== "true";
const migrationsDir = path.join(__dirname, "migrations");

console.log(`DB schema: ${process.env.DB_SCHEMA || "public"}`);
console.log(`DB synchronize: ${process.env.DB_SYNCHRONIZE}`);
console.log(`Migrations enabled: ${shouldRunMigrations}`);
console.log(`Migration glob: ${path.join(__dirname, "./migrations/*.+(js|ts)")}`);
console.log(`Migrations dir exists: ${fs.existsSync(migrationsDir)}`);
if (fs.existsSync(migrationsDir)) {
  console.log(`Migration files: ${fs.readdirSync(migrationsDir).join(", ")}`);
}

populateOnFirstRun(config)
  .then(() => {
    if (!shouldRunMigrations) {
      console.log("Skipping migrations because DB_SYNCHRONIZE=true");
      return;
    }
    console.log("Starting Vendure migrations...");
    return runMigrations(config);
  })
  .then(() => {
    if (shouldRunMigrations) {
      console.log("Vendure migrations finished");
    }
  })
  .then(() => bootstrap(config))
  .then((app) => {
    // For "lite" deployments with limited resources, we can run the job queue
    if (process.env.RUN_JOB_QUEUE_FROM_SERVER?.toLowerCase() === "true") {
      return app.get(JobQueueService).start();
    }
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
