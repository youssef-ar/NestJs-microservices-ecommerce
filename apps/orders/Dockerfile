FROM node:alpine As development

WORKDIR /usr/src/app

# Copy configuration and package files first
COPY ./apps/orders/package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nodemon.json ./
COPY nest-cli.json ./
COPY eslint.config.mjs ./

# Install dependencies
RUN npm install

# Create directories
RUN mkdir -p apps/orders

# Copy application code
COPY ./apps/orders ./apps/orders


# Build the application
RUN npm run build orders

# Command to run the application
CMD ["npm", "run", "start:dev", "orders"]

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY ./apps/orders/package*.json ./

COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nodemon.json ./
COPY nest-cli.json ./
COPY eslint.config.js ./

RUN npm install --only=production

COPY ./apps/orders .

RUN npx prisma generate --schema=./apps/orders/prisma/schema.prisma

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]