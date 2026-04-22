# ── Build Stage ────────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Install all dependencies (including devDeps needed for build)
COPY package*.json ./
RUN npm ci

# Copy source and compile TypeScript → JavaScript
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ── Production Stage ───────────────────────────────────────────────────────────
FROM node:18-alpine AS production

WORKDIR /usr/src/app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output from builder stage
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 5000

# Start the compiled server
CMD ["node", "dist/server.js"]
