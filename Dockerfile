FROM node:20

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN rm -rf dist
RUN yarn build
RUN yarn build:admin
