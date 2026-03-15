# Stage 1: Build frontend
FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Stage 2: Build backend (compile TypeScript)
FROM node:18-alpine AS build-backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npx prisma generate && npm run build

# Stage 3: Final image
FROM node:18-alpine
RUN apk add --no-cache nginx

# Install production dependencies and generate Prisma client
WORKDIR /app/backend
COPY backend/package*.json ./
COPY backend/prisma ./prisma
RUN npm ci --omit=dev && npx prisma generate

# Copy compiled backend
COPY --from=build-backend /app/backend/dist ./dist

# Copy nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy frontend build
COPY --from=build-frontend /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

# Run migrations, seed sample data, then start backend + nginx
CMD sh -c "npx prisma migrate deploy && node dist/seed.js; node dist/server.js & nginx -g 'daemon off;'"
