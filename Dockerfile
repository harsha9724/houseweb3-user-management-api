# Stage 1: Base stage for dependencies
FROM node:alpine AS base
WORKDIR /src/app
COPY package*.json ./
RUN npm ci
COPY . .

# Stage 2: Test stage
FROM base AS test
RUN npm test

# Stage 3: Production stage
FROM base AS prod
CMD ["npm", "start"]
