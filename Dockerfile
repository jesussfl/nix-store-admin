FROM node:20-bookworm-slim AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --non-interactive

COPY . .

ENV NODE_ENV=production

RUN yarn build:admin
RUN yarn build

FROM node:20-bookworm-slim AS runtime

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --production=true --non-interactive && yarn cache clean

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/static ./dist/static

EXPOSE 3000 3002

CMD ["yarn", "start"]
