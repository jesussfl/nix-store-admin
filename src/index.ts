import { bootstrap, JobQueueService, runMigrations } from "@vendure/core";
import "./config";
import { config } from "./vendure-config";
import { populateOnFirstRun } from "./populate";

// Mostrar mensaje informativo sobre el entorno actual
console.log(`Running server in ${process.env.NODE_ENV} mode`);
const shouldRunMigrations = process.env.DB_SYNCHRONIZE !== "true";

populateOnFirstRun(config)
  .then(() => {
    if (!shouldRunMigrations) {
      console.log("Skipping migrations because DB_SYNCHRONIZE=true");
      return;
    }
    return runMigrations(config);
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
