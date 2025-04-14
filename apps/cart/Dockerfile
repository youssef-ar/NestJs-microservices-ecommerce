FROM node:alpine As development

WORKDIR /usr/src/app

# Copy configuration and package files first
COPY ./apps/cart/package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nodemon.json ./
COPY nest-cli.json ./
COPY eslint.config.mjs ./

# Install dependencies
RUN npm install

# Create directories
RUN mkdir -p apps/cart

# Copy application code
COPY ./apps/cart ./apps/cart

# Generate Prisma client before building
RUN npx prisma generate --schema=./apps/cart/prisma/schema.prisma

# Build the application
RUN npm run build cart

# Command to run the application
CMD ["npm", "run", "start:migrate:prod", "cart"]

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY ./apps/cart/package*.json ./

COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nodemon.json ./
COPY nest-cli.json ./
COPY eslint.config.js ./

RUN npm install --only=production

COPY ./apps/cart .

RUN npx prisma generate --schema=./apps/cart/prisma/schema.prisma

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]