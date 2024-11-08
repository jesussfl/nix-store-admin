FROM node:20

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production
COPY . .
RUN yarn build
RUN yarn build:admin
CMD ["yarn", "run", "start:server"]
