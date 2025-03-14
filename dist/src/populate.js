"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateOnFirstRun = void 0;
const cli_1 = require("@vendure/core/cli");
const core_1 = require("@vendure/core");
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
/**
 * @description
 * This function is responsible for populating the DB with test data on the first run. It
 * first checks to see if the configured DB has any tables, and if not, runs the `populate()`
 * function using data from the @vendure/create package.
 */
async function populateOnFirstRun(config) {
    const dbTablesAlreadyExist = await tablesExist(config);
    if (!dbTablesAlreadyExist) {
        console.log(`No Vendure tables found in DB. Populating database...`);
        return (0, cli_1.populate)(() => (0, core_1.bootstrap)({
            ...config,
            importExportOptions: {
                importAssetsDir: path_1.default.join(require.resolve("../products.csv"), "../images"),
            },
            dbConnectionOptions: { ...config.dbConnectionOptions, synchronize: true },
        }), require("../initial-data.json"), require.resolve("../products.csv"))
            .then((app) => app.close())
            .catch((err) => {
            console.log(err);
            process.exit(1);
        });
    }
    else {
        return;
    }
}
exports.populateOnFirstRun = populateOnFirstRun;
async function tablesExist(config) {
    const connection = await (0, typeorm_1.createConnection)(config.dbConnectionOptions);
    const result = await connection.query(`
        select n.nspname as table_schema,
               c.relname as table_name,
               c.reltuples as rows
        from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
        where c.relkind = 'r'
              and n.nspname = '${process.env.DB_SCHEMA}'
        order by c.reltuples desc;`);
    await connection.close();
    return 0 < result.length;
}
