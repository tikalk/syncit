FROM node:lts
WORKDIR /app
COPY ./dist/apps/microservices/calendars .
COPY ./libs/models/src/prisma ./prisma/
COPY ./.env .
ENV PORT=3335
ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/syncit?schema=syncit"
EXPOSE ${PORT}
RUN yarn install --production --frozen-lockfile
RUN npx prisma generate --schema=prisma/prisma.schema
ENV NODE_ENV=production
CMD node main.js
