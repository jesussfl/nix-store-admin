# nix-store-admin

This project was generated with [`@vendure/create`](https://github.com/vendure-ecommerce/vendure/tree/master/packages/create).

Useful links:

- [Vendure docs](https://www.vendure.io/docs)
- [Vendure Discord community](https://www.vendure.io/community)
- [Vendure on GitHub](https://github.com/vendure-ecommerce/vendure)
- [Vendure plugin template](https://github.com/vendure-ecommerce/plugin-template)

## Directory structure

* `/src` contains the source code of your Vendure server. All your custom code and plugins should reside here.
* `/static` contains static (non-code) files such as assets (e.g. uploaded images) and email templates.

## Development

```
npm run dev
```

will start the Vendure server and [worker](https://www.vendure.io/docs/developer-guide/vendure-worker/) processes from
the `src` directory.

### Docker development

To start the full local development stack with Docker:

```bash
yarn docker:dev
```

This runs Docker Compose in watch mode, so source changes are synced into the running containers automatically.

This starts:

- Vendure server on `http://localhost:3000`
- Vendure Admin UI on `http://localhost:3002`
- Postgres on `localhost:5432`

Docker Compose reads [`.env.development`](./.env.development) and overrides `DB_HOST` to use the `database`
container, so the same env file still works for non-Docker local development too.

To stop and remove the development containers and volumes:

```bash
yarn docker:dev:down
```

If you want to run the same dev stack without file watch mode:

```bash
yarn docker:dev:plain
```

### k6 resource testing

This repo includes a `k6` setup for basic Vendure smoke/load checks.

Start the app stack first:

```bash
yarn docker:dev
```

Then run the bundled scenario from the repo root:

```bash
yarn k6:resources
```

That script runs `grafana/k6` through Docker Compose and targets the internal service URL
`http://server:3000` by default.

If your Vendure server is running on the host machine instead of inside Docker, use:

```bash
yarn k6:resources:local
```

You can customize the target by setting `K6_BASE_URL` before running the command.

## Build

```
npm run build
```

will compile the TypeScript sources into the `/dist` directory.

## Production

For production, there are many possibilities which depend on your operational requirements as well as your production
hosting environment.

### Running directly

You can run the built files directly with the `start` script:

```
npm run start
```

You could also consider using a process manager like [pm2](https://pm2.keymetrics.io/) to run and manage
the server & worker processes.

### Using Docker

For production, use [Dockerfile.prod](./Dockerfile.prod):

```
docker build -f Dockerfile.prod -t vendure .
```

Or start the production compose stack with:

```
yarn docker:prod
```

### Docker compose

We've included a sample [docker-compose.yml](./docker-compose.yml) file which demonstrates how the server, worker, and
database may be orchestrated with Docker Compose.

## Plugins

In Vendure, your custom functionality will live in [plugins](https://www.vendure.io/docs/plugins/).
These should be located in the `./src/plugins` directory.

To create a new plugin run:

```
npx vendure add
```

and select `[Plugin] Create a new Vendure plugin`.

## Migrations

[Migrations](https://www.vendure.io/docs/developer-guide/migrations/) allow safe updates to the database schema. Migrations
will be required whenever you make changes to the `customFields` config or define new entities in a plugin.

To generate a new migration, run:

```
npx vendure migrate
```

The generated migration file will be found in the `./src/migrations/` directory, and should be committed to source control.
Next time you start the server, and outstanding migrations found in that directory will be run by the `runMigrations()`
function in the [index.ts file](./src/index.ts).

If, during initial development, you do not wish to manually generate a migration on each change to customFields etc, you
can set `dbConnectionOptions.synchronize` to `true`. This will cause the database schema to get automatically updated
on each start, removing the need for migration files. Note that this is **not** recommended once you have production
data that you cannot lose.

---

You can also run any pending migrations manually, without starting the server via the "vendure migrate" command.

---

## Troubleshooting

### Error: Could not load the "sharp" module using the \[OS\]-x\[Architecture\] runtime when running Vendure server.

- Make sure your Node version is ^18.17.0 || ^20.3.0 || >=21.0.0 to support the Sharp library.
- Make sure your package manager is up to date.
- **Not recommended**: if none of the above helps to resolve the issue, install sharp specifying your machines OS and Architecture. For example: `pnpm install sharp --config.platform=linux --config.architecture=x64` or `npm install sharp --os linux --cpu x64`

