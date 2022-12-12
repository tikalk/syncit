FROM node:lts
WORKDIR /app
COPY ./dist/apps/microservices/integrations .
COPY ./libs/models/src/prisma ./prisma/
COPY ./.env .
ENV PORT=3336
ENV DATABASE_URL="postgresql://postgres:postgres@database:5433/syncit?schema=syncit"
EXPOSE ${PORT}
RUN yarn install --production --frozen-lockfile
RUN npx prisma generate --schema=prisma/prisma.schema
ENV NODE_ENV=production
CMD node main.js
