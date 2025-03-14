# Stage 1: Base stage for dependencies
FROM node:alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
RUN npm run build

# Stage 2: Test stage
# FROM base AS test
# ARG TEST_DB_URL
# ENV TEST_DB_URL=$TEST_DB_URL
# RUN echo "TEST_DB_URL: $TEST_DB_URL" # For debugging
# RUN npm test

# Stage 3: Production stage
FROM nginx:stable-alpine
COPY --from=base /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["ngnix", "-g", "daemon off;"]
