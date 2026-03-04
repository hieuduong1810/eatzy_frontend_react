# Stage 1: build với Node.js
FROM node:20-alpine AS build
ARG APP_NAME
ARG VITE_MAPBOX_ACCESS_TOKEN
WORKDIR /app

# Cài pnpm
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

# Copy dependency files trước để tận dụng Docker cache
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code và build
COPY . .
RUN pnpm run build:${APP_NAME} && mv dist/${APP_NAME}.html dist/index.html

# Stage 2: serve bằng Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
