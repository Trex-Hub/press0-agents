# Stage 1: Builder
# Install dependencies and build the application
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package configuration
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev) for building
RUN pnpm install --frozen-lockfile

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN pnpm prisma generate

# Copy source code
COPY . .

# Build the Mastra application
RUN pnpm build

# Prune to production dependencies to reduce size
# This removes devDependencies from node_modules
RUN pnpm prune --prod


# Stage 2: Runner
# Create the final lightweight production image
FROM node:20-alpine AS runner

# Install pnpm (needed for any runtime scripts or valid node_modules structure)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Copy only necessary files from builder
# 1. Package files
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# 2. Production dependencies (pruned in builder stage)
#    This includes the generated Prisma Client inside node_modules
COPY --from=builder /app/node_modules ./node_modules

# 3. Prisma schema (useful for reference or migrations if needed)
COPY --from=builder /app/prisma ./prisma

# 4. Built application artifacts
COPY --from=builder /app/.mastra ./.mastra

# Expose the application port
EXPOSE 8080

# Start the Mastra server
CMD ["node", "--import=./.mastra/output/instrumentation.mjs", ".mastra/output/index.mjs"]
