# ── Build Stage ────────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ── Production Stage ───────────────────────────────────────────────────────────
FROM node:18-alpine AS production
WORKDIR /usr/src/app

# Variables de entorno para optimización
ENV NODE_ENV=production
# Cloud Run define su propio PORT (usualmente 8080)
ENV PORT=8080

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

# El puerto 8080 es el estándar de GCP
EXPOSE 8080

CMD ["node", "dist/server.js"]