FROM node:alpine As development

WORKDIR /usr/src/app

# Copy configuration and package files first
COPY ./apps/inventory/package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nodemon.json ./
COPY nest-cli.json ./
COPY eslint.config.mjs ./

# Install dependencies
RUN npm install

# Create directories
RUN mkdir -p apps/inventory

# Copy application code
COPY ./apps/inventory ./apps/inventory



# Build the application
RUN npm run build inventory

# Command to run the application
CMD ["npm", "run", "start:dev:with-migrations", "inventory"]

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY ./apps/inventory/package*.json ./

COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nodemon.json ./
COPY nest-cli.json ./
COPY eslint.config.js ./

RUN npm install --only=production

COPY ./apps/inventory .

RUN npx prisma generate --schema=./apps/inventory/prisma/schema.prisma

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]