"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@vendure/core");
require("./config");
const vendure_config_1 = require("./vendure-config");
const populate_1 = require("./populate");
// Mostrar mensaje informativo sobre el entorno actual
console.log(`Running server in ${process.env.NODE_ENV} mode`);
(0, populate_1.populateOnFirstRun)(vendure_config_1.config)
    .then(() => (0, core_1.runMigrations)(vendure_config_1.config))
    .then(() => (0, core_1.bootstrap)(vendure_config_1.config))
    .then((app) => {
    var _a;
    // For "lite" deployments with limited resources, we can run the job queue
    if (((_a = process.env.RUN_JOB_QUEUE_FROM_SERVER) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "true") {
        return app.get(core_1.JobQueueService).start();
    }
})
    .catch((err) => {
    console.log(err);
});
