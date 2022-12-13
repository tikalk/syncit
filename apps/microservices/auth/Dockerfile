FROM node:lts
WORKDIR /app
COPY ./dist/apps/microservices/auth .
COPY ./libs/models/src/prisma ./prisma/
ENV PORT=3334
ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/syncit?schema=syncit"
EXPOSE ${PORT}
RUN yarn install --production --frozen-lockfile
RUN npx prisma generate --schema=prisma/prisma.schema
ENV NODE_ENV=production
CMD npx prisma migrate dev --schema=prisma/prisma.schema && npx prisma generate --schema=prisma/prisma.schema && npx prisma db push --schema=prisma/prisma.schema && node main.js
