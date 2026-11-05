# ---------- Tahap 1: build React (Vite) ----------
FROM node:22-alpine AS build
WORKDIR /app

# Install dependency dulu agar layer ini ter-cache selama package*.json tidak berubah
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# ---------- Tahap 2: sajikan file statis dengan Nginx ----------
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/healthz || exit 1
