# Vendure 3.6.3 Production Deployment Checklist

This checklist is for deploying the Vendure 3.6.3 admin upgrade to `main` and letting Northflank auto-deploy it. It assumes production uses `Dockerfile.prod` and, where applicable, `docker-compose.prod.yml`.

## What Changed

- Vendure packages are upgraded to `3.6.3`.
- Elasticsearch plugin moved from `@vendure/elasticsearch-plugin` to `@vendure-community/elasticsearch-plugin`.
- Elasticsearch client/image must be `9.1.0`.
- A Vendure 3.6 migration was generated at `src/migrations/1779843269472-v36.ts`.
- The migration includes the required data-copy helpers:
  - `migrateProductOptionGroupData(queryRunner)` before dropping `product_option_group.productId`
  - `migrateAssetTranslationData(queryRunner)` before dropping `asset.name`
- TypeORM `synchronize` is disabled in code. Do not re-enable it in production.

## Before Merging To Main

1. Confirm these files are included in the commit:

```bash
git status --short
```

Commit the source/config files needed for deploy:

```text
package.json
yarn.lock
Dockerfile.prod
docker-compose.prod.yml
src/index.ts
src/vendure-config.ts
src/migrations/1779843269472-v36.ts
src/plugins/news-plugin/ui/components/storefront-news-detail/storefront-news-detail.component.ts
tsconfig.json
```

Do not commit local-only files:

```text
.env.development
.env.production
backups/
node_modules/
admin-ui/
```

`dist/` is build output. Since `Dockerfile.prod` builds inside Docker, it should not be required for Northflank image builds.

2. Run local verification:

```bash
yarn build
NODE_ENV=development yarn migration:run
```

3. Review the migration before merging:

```bash
sed -n '1,80p' src/migrations/1779843269472-v36.ts
```

Make sure the helper calls are still before the destructive drops.

## Production Database Backup

Before the Northflank deploy starts, create a production database backup.

For Postgres, use the backup feature from your database provider or run an equivalent `pg_dump` against the production DB:

```bash
pg_dump "$DATABASE_URL" -Fc -f pre-vendure-3.6.3.dump
```

Keep this backup somewhere outside the container filesystem.

This step matters because Vendure 3.6 moves existing asset names and product option group relationships into new tables.

## Northflank Environment Variables

In the Northflank service/job environment, confirm:

```text
NODE_ENV=production
DB_RUN_MIGRATIONS=true
VENDURE_DISABLE_TELEMETRY=true
```

`DB_RUN_MIGRATIONS` can also be omitted, because the server runs migrations unless it is exactly `false`.

Do not set or rely on:

```text
DB_SYNCHRONIZE=true
```

The code now forces `synchronize: false`, which is the safe production behavior.

Also confirm the production DB variables are correct:

```text
DB_HOST
DB_PORT
DB_NAME
DB_SCHEMA
DB_USERNAME
DB_PASSWORD
DB_SSL
DB_SSL_REJECT_UNAUTHORIZED
```

## Northflank Build Settings

If Northflank builds from the Dockerfile, use:

```text
Dockerfile: Dockerfile.prod
Build context: .
Port: 3000
```

`Dockerfile.prod` does this during image build:

```bash
yarn install --non-interactive
yarn build
```

The runtime command for the API service should be:

```bash
yarn start:server
```

The worker service should use the same image with:

```bash
yarn start:worker
```

If using Northflank compose deployment with `docker-compose.prod.yml`, make sure Northflank is actually reading that compose file from the repo. Note that `.dockerignore` excludes `docker-compose.prod.yml` from Docker image context, which is fine for Dockerfile builds but not relevant to Git-based compose parsing.

## Deployment Order

Recommended safe order:

1. Pause or scale down the worker service.
2. Deploy the server service.
3. Let `start:server` run pending migrations.
4. Confirm the server boots successfully.
5. Deploy or scale the worker service back up.

The server runs migrations in `src/index.ts`. The worker does not run migrations, so avoid starting the new worker against the old schema before the server migration finishes.

## Merge And Auto-Deploy

From the upgrade branch:

```bash
git status --short
git add package.json yarn.lock Dockerfile.prod docker-compose.prod.yml src tsconfig.json
git commit -m "Upgrade Vendure admin to 3.6.3"
git push origin HEAD
```

Open a PR into `main`, review it, and merge.

After merge, Northflank should automatically build and deploy from `main`.

Watch the Northflank build logs for:

```text
yarn build
```

Watch the runtime logs for migration/startup success:

```text
Starting Vendure migrations...
Vendure migrations finished
```

## After Deploy

Check:

- Admin API responds on `/admin-api`.
- Shop API responds on `/shop-api`.
- Admin UI loads.
- Products with options still show their option groups.
- Existing asset names/previews still appear in the dashboard.
- New API Keys page appears in the dashboard.
- Worker starts and processes jobs.

If using Elasticsearch in production, confirm the service is upgraded to Elasticsearch `9.1.0`, then run a full Vendure search reindex after deploy.

## Rollback

If the deploy fails before migrations run, roll back the Northflank image/service to the previous commit.

If migrations ran and production data is wrong, restore the production DB backup first, then roll back the app image. Do not run an older Vendure version against the already-migrated 3.6 schema.
