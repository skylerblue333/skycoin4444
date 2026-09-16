FROM node:24-bookworm-slim

WORKDIR /app

RUN npm install --global pnpm@11.20.0

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build
RUN chown -R node:node /app

ENV NODE_ENV=production
EXPOSE 3000

USER node

CMD ["pnpm", "start"]
