FROM node:alpine As development

WORKDIR /usr/src/app

# Copy configuration and package files first
COPY ./apps/users/package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nodemon.json ./
COPY nest-cli.json ./
COPY eslint.config.mjs ./

# Install dependencies
RUN npm install

# Create directories
RUN mkdir -p apps/users

# Copy application code
COPY ./apps/users ./apps/users

# Generate Prisma client before building
RUN npx prisma generate --schema=./apps/users/prisma/schema.prisma

# Build the application
RUN npm run build users

# Command to run the application
CMD ["npm", "run", "start:migrate:dev", "users"]

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY ./apps/users/package*.json ./

COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nodemon.json ./
COPY nest-cli.json ./
COPY eslint.config.js ./

RUN npm install --only=production

COPY ./apps/users .

RUN npx prisma generate --schema=./apps/users/prisma/schema.prisma

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]