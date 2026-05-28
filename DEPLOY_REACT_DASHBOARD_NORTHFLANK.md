# Vendure React Dashboard Northflank Deployment

This checklist describes how to deploy the new Vendure React Dashboard for `nix-store-admin` on Northflank.

The Dashboard is built into the same Vendure server image and served by Vendure at:

```text
/dashboard
```

There is no separate production Vite service. Vite is only used during local development and Docker dev.

## Current Project Setup

The production build is expected to:

```bash
yarn build
```

That script runs:

```bash
yarn build:dashboard
cross-env NODE_ENV=production tsc
```

The dashboard build output must exist at:

```text
dist/dashboard/index.html
```

Vendure serves that directory from `src/vendure-config.ts`:

```ts
DashboardPlugin.init({
  route: "dashboard",
  appDir: path.join(__dirname, "../dist/dashboard"),
})
```

## Files To Commit

Before deploying to Northflank, make sure the dashboard integration files are committed:

```text
package.json
yarn.lock
Dockerfile
Dockerfile.prod
tsconfig.json
tsconfig.dashboard.json
vite.config.mts
src/vendure-config.ts
src/plugins/lotes-plugin/lote.plugin.ts
src/plugins/lotes-plugin/dashboard/
src/plugins/news-plugin/news.plugin.ts
src/plugins/news-plugin/dashboard/
src/gql/
```

Do not commit local-only or generated runtime files unless you intentionally track them:

```text
.env
.env.production
node_modules/
admin-ui/
dist/
backups/
```

`dist/` is generated inside the Docker build.

## Northflank Build Settings

Use Dockerfile-based deployment.

```text
Dockerfile: Dockerfile.prod
Build context: .
Internal port: 3000
Public HTTP port: 3000
```

`Dockerfile.prod` should use Node 22 and should include this production build check:

```dockerfile
RUN yarn build
RUN test -f /usr/src/app/dist/dashboard/index.html
```

That check is important because it fails the image build if the React Dashboard was not built.

Do not expose these ports in production:

```text
3002
4200
5173
```

Port `5173` is only for local Vite development.

## Server Service

The Northflank server service should run the same image with:

```bash
yarn start:server
```

The server service must expose port:

```text
3000
```

After deploy, these paths should be served by the same service:

```text
/admin-api
/shop-api
/assets
/dashboard
```

## Worker Service

The worker should use the same Docker image as the server, but with a different command:

```bash
yarn start:worker
```

The worker does not need to expose a public port.

Keep the worker and server on the same image tag or same Git commit so plugin code, GraphQL schema, migrations, and entity definitions stay aligned.

## Environment Variables

Confirm these are set on the Northflank server and worker services:

```text
NODE_ENV=production
PORT=3000
APP_HOST=https://your-production-admin-domain
VENDURE_DISABLE_TELEMETRY=true

SUPERADMIN_USERNAME=...
SUPERADMIN_PASSWORD=...
COOKIE_SECRET=...

DB_HOST=...
DB_PORT=...
DB_NAME=...
DB_SCHEMA=...
DB_USERNAME=...
DB_PASSWORD=...
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

If your production database requires verified CA certificates, use:

```text
DB_SSL_REJECT_UNAUTHORIZED=true
```

Migrations are run by the server unless this is set exactly:

```text
DB_RUN_MIGRATIONS=false
```

For normal deploys, leave `DB_RUN_MIGRATIONS` unset or set it to:

```text
DB_RUN_MIGRATIONS=true
```

Do not set:

```text
DB_SYNCHRONIZE=true
```

The project config already forces `synchronize: false`, which is the correct production behavior.

## Asset Storage

The dashboard will show uploaded news images through Vendure assets.

For production, attach persistent storage for:

```text
static/assets
```

Then point Vendure at that mounted path:

```text
ASSET_UPLOAD_DIR=/usr/src/app/static/assets
```

If Northflank mounts a volume somewhere else, set `ASSET_UPLOAD_DIR` to that mount path.

Also set `APP_HOST` to the public HTTPS origin so production asset URLs are generated correctly:

```text
APP_HOST=https://your-production-admin-domain
```

## Deployment Order

Recommended order:

1. Build the image from `Dockerfile.prod`.
2. Deploy the server service first.
3. Let the server run migrations.
4. Confirm the server starts successfully.
5. Deploy or restart the worker service.

This matters because the server runs migrations in `src/index.ts`; the worker does not.

## Verification After Deploy

Check the Northflank build logs for:

```text
yarn build:dashboard
vite build
tsc
dist/dashboard/index.html
```

Check the server runtime logs for:

```text
Starting Vendure migrations...
Vendure migrations finished
```

Then test these URLs:

```text
https://your-production-admin-domain/admin-api
https://your-production-admin-domain/shop-api
https://your-production-admin-domain/dashboard
```

In the dashboard, verify:

```text
Login works
Lotes appears in the nav
Lotes list loads
Lotes create/update/delete works
Storefront News appears in the nav
Storefront News list loads
News create/update/delete works
News image selection persists
News image previews render
```

## Common Failure Modes

If `/dashboard` shows the Vendure placeholder page:

```text
Build your dashboard or run in development mode to get started.
```

Then `dist/dashboard/index.html` was not present in the runtime image. Check:

```text
Dockerfile.prod runs yarn build
Dockerfile.prod copies /usr/src/app/dist into runtime
The build log includes vite build
The build log passes test -f /usr/src/app/dist/dashboard/index.html
```

If `/dashboard` loads but API requests fail, check:

```text
APP_HOST
COOKIE_SECRET
CORS allowed origins in src/vendure-config.ts
The browser is using the same HTTPS origin for /dashboard and /admin-api
```

If images are missing after a redeploy, check:

```text
ASSET_UPLOAD_DIR points to persistent storage
The asset volume is mounted on both server and worker if both process asset jobs
APP_HOST is the public HTTPS origin
```

If the build fails with Node engine errors, make sure Northflank is using the Dockerfile and not a buildpack. The Dockerfiles use:

```text
node:22-bookworm-slim
```

## Rollback

If the image fails before migrations run, roll back the Northflank service to the previous image or commit.

If migrations ran and data is affected, restore the production database backup first, then roll back the image. Do not run an older Vendure version against a newer migrated schema.
