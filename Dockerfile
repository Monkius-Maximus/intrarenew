# Stage 1: Build frontend
FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Stage 2: Final image
FROM node:18-alpine
RUN apk add --no-cache nginx

# Setup backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npx prisma generate

# Copy nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy frontend build
COPY --from=build-frontend /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD sh -c "npx prisma migrate deploy && npx ts-node src/seed.ts; npx ts-node src/server.ts & nginx -g 'daemon off;'"
