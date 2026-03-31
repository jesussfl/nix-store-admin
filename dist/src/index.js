"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@vendure/core");
require("./config");
const vendure_config_1 = require("./vendure-config");
const populate_1 = require("./populate");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Mostrar mensaje informativo sobre el entorno actual
console.log(`Running server in ${process.env.NODE_ENV} mode`);
const shouldRunMigrations = process.env.DB_SYNCHRONIZE !== "true";
const migrationsDir = path_1.default.join(__dirname, "migrations");
console.log(`DB schema: ${process.env.DB_SCHEMA || "public"}`);
console.log(`DB synchronize: ${process.env.DB_SYNCHRONIZE}`);
console.log(`Migrations enabled: ${shouldRunMigrations}`);
console.log(`Migration glob: ${path_1.default.join(__dirname, "./migrations/*.+(js|ts)")}`);
console.log(`Migrations dir exists: ${fs_1.default.existsSync(migrationsDir)}`);
if (fs_1.default.existsSync(migrationsDir)) {
    console.log(`Migration files: ${fs_1.default.readdirSync(migrationsDir).join(", ")}`);
}
(0, populate_1.populateOnFirstRun)(vendure_config_1.config)
    .then(() => {
    if (!shouldRunMigrations) {
        console.log("Skipping migrations because DB_SYNCHRONIZE=true");
        return;
    }
    console.log("Starting Vendure migrations...");
    return (0, core_1.runMigrations)(vendure_config_1.config);
})
    .then(() => {
    if (shouldRunMigrations) {
        console.log("Vendure migrations finished");
    }
})
    .then(() => (0, core_1.bootstrap)(vendure_config_1.config))
    .then((app) => {
    var _a;
    // For "lite" deployments with limited resources, we can run the job queue
    if (((_a = process.env.RUN_JOB_QUEUE_FROM_SERVER) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "true") {
        return app.get(core_1.JobQueueService).start();
    }
})
    .catch((err) => {
    console.error(err);
    process.exit(1);
});
