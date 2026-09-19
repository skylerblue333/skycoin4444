FROM node:24-bookworm-slim AS build

WORKDIR /app

# Build tooling is intentionally confined to this stage. It must not be
# present in the production image or become part of its vulnerability surface.
RUN npm install --global pnpm@11.20.0

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:24-bookworm-slim AS production-deps

WORKDIR /app

# Resolve only the root application's production dependency graph. The root
# importer is self-contained in pnpm-lock.yaml, so workspace source/packages
# and build tooling never enter this stage or the final runtime image.
RUN npm install --global pnpm@11.20.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --prod --frozen-lockfile \
    && rm -rf \
      node_modules/typescript \
      node_modules/.pnpm/typescript@* \
      node_modules/.pnpm/@typescript+typescript-* \
    && find node_modules -type l -xtype l -delete \
    && node --input-type=module -e "await import('@trpc/server/adapters/express'); await import('express');"

FROM node:24-bookworm-slim AS runtime

WORKDIR /app

# Apply available Debian security fixes and remove package-manager tooling that
# the runtime never executes. This reduces both the installed attack surface
# and scanner-visible dependencies without weakening security gates.
RUN apt-get update \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
    && rm -f \
      /usr/local/bin/npm \
      /usr/local/bin/npx \
      /usr/local/bin/corepack \
      /usr/local/bin/pnpm \
      /usr/local/bin/pnpx \
      /usr/local/bin/yarn \
      /usr/local/bin/yarnpkg

ENV NODE_ENV=production

COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=production-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./package.json

EXPOSE 3000

USER node

CMD ["node", "dist/index.js"]
