FROM oven/bun:latest AS base

WORKDIR /app

# Only copy files needed for install step first
COPY bun.lockb* package.json tsconfig.json ./

# Install dependencies (cached unless lockfile changes)
RUN bun install

# Copy rest of app
COPY . .

FROM oven/bun:slim

WORKDIR /app

# Copy node_modules and app from previous stage
COPY --from=base /app /app

EXPOSE 8000

CMD ["bun", "index.ts"]