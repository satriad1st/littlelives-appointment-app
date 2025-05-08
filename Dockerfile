FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Please also commit synced package.lock if you add new depedencies or updating the version
# https://support.deploybot.com/article/131-why-developers-should-use-npm-ci-instead-of-npm-install-and-its-benefits#:~:text=npm%20ci%20is%20a%20command%20that,in%20the%20package%2Dlock.json%20file.
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/backend ./backend
COPY --from=builder --chown=nextjs:nodejs /app/config ./config
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/shared ./shared
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./
COPY --from=builder --chown=nextjs:nodejs /app/package*json ./
COPY --from=builder --chown=nextjs:nodejs /app/postcss.config.mjs ./
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig*json ./
COPY --from=builder --chown=nextjs:nodejs /app/server.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/tailwind.config.ts ./

USER nextjs

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE ${WEBAPP_PORT}

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "dist/server.js"]

FROM base AS development
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "dev" ]
