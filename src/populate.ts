import { populate } from "@vendure/core/cli";
import { bootstrap, VendureConfig } from "@vendure/core";
import { createConnection } from "typeorm";
import fs from "fs";
import path from "path";

/**
 * @description
 * This function is responsible for populating the DB with test data on the first run. It
 * first checks to see if the configured DB has any tables, and if not, runs the `populate()`
 * function using data from the @vendure/create package.
 */
export async function populateOnFirstRun(config: VendureConfig) {
  const dbTablesAlreadyExist = await tablesExist(config);
  if (!dbTablesAlreadyExist) {
    console.log(`No Vendure tables found in DB. Populating database...`);
    const initialDataPath = resolveProjectPath("initial-data.json");
    const productsCsvPath = resolveProjectPath("products.csv");
    const imagesDirPath = resolveProjectPath("images");

    return populate(
      () =>
        bootstrap({
          ...config,
          importExportOptions: {
            importAssetsDir: imagesDirPath,
          },
          dbConnectionOptions: { ...config.dbConnectionOptions, synchronize: true },
        }),
      require(initialDataPath),
      productsCsvPath
    )
      .then((app) => app.close())
      .catch((err) => {
        console.log(err);
        process.exit(1);
      });
  } else {
    return;
  }
}

function resolveProjectPath(relativePath: string): string {
  const candidates = [
    path.resolve(process.cwd(), relativePath),
    path.resolve(__dirname, "..", relativePath),
    path.resolve(__dirname, "..", "..", relativePath),
  ];

  const resolvedPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!resolvedPath) {
    throw new Error(
      `Could not find "${relativePath}". Checked: ${candidates.join(", ")}`
    );
  }

  return resolvedPath;
}

async function tablesExist(config: VendureConfig) {
  const connection = await createConnection(config.dbConnectionOptions);
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
