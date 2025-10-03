# -----------------------------
# Builder stage
# -----------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package manifests first for caching
COPY package*.json ./

# Install all deps (dev + prod) for build
RUN npm install --legacy-peer-deps

# Copy rest of source
COPY . .

# 👇 Prevent telemetry + lockfile patch issues
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_SKIP_LOCKFILE_PATCH=true

# Build Next.js standalone output
RUN npm run build

# -----------------------------
# Runner stage
# -----------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only required files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port (good practice, not mandatory with compose)
EXPOSE 3000

# Run Next.js standalone server
CMD ["node", "server.js"]
