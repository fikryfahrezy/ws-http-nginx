FROM node:22.9.0-bookworm AS base

# Step 1
FROM base AS fedeps
WORKDIR /app

COPY fe/package.json fe/yarn.lock* fe/package-lock.json* fe/pnpm-lock.yaml* ./

# https://github.com/pnpm/pnpm/issues/9029
# https://github.com/nodejs/corepack/issues/612
RUN npm install -g corepack@latest
RUN corepack enable pnpm
RUN pnpm i --frozen-lockfile

# Step 2
FROM base AS febuilder
WORKDIR /app

COPY --from=fedeps /app/node_modules ./node_modules
COPY fe/ .

RUN npm run build

# Step 3
FROM base AS bedeps
WORKDIR /app

COPY be/package.json be/yarn.lock* be/package-lock.json* be/pnpm-lock.yaml* ./

RUN npm install -g corepack@latest
RUN corepack enable pnpm
RUN pnpm i --frozen-lockfile

# Step 4
FROM base AS bebuilder
WORKDIR /app

COPY --from=bedeps /app/node_modules ./node_modules
COPY be/ .
COPY --from=febuilder /app/dist ./dist

CMD ["node", "index.mjs"]