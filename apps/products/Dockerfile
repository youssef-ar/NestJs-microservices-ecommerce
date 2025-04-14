FROM node:alpine As development

WORKDIR /usr/src/app

COPY ./apps/products/package*.json ./

COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nodemon.json ./
COPY nest-cli.json ./
COPY eslint.config.mjs ./

RUN npm install

RUN mkdir apps
RUN mkdir apps/products

COPY ./apps/products ./apps/products

RUN npx prisma generate --schema ./apps/products/prisma/schema.prisma

RUN npm run build products

CMD ["npm", "run", "start:migrate:dev", "orders"]

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY ./apps/products/package*.json ./

COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nodemon.json ./
COPY nest-cli.json ./
COPY eslint.config.js ./

RUN npm install --only=production

COPY ./apps/products .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]