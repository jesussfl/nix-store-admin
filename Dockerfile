FROM node:20-bookworm-slim AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --non-interactive

COPY . .

ENV NODE_ENV=production

RUN yarn build:admin
RUN yarn build
RUN test -f /usr/src/app/dist/admin-ui/dist/browser/vendure-ui-config.json

FROM node:20-bookworm-slim AS runtime

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --production=true --non-interactive && yarn cache clean

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/dist/admin-ui ./dist/admin-ui
COPY --from=build /usr/src/app/static ./dist/static
COPY --from=build /usr/src/app/initial-data.json ./initial-data.json
COPY --from=build /usr/src/app/products.csv ./products.csv
COPY --from=build /usr/src/app/images ./images

EXPOSE 3000 3002

CMD ["yarn", "start:server"]
