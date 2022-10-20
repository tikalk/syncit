FROM node:18-slim

RUN apt-get update

RUN apt-get install -y openssl

WORKDIR /app

COPY ./dist/apps/microservices/auth .

COPY ./libs/models/src/prisma/prisma.schema ./prisma.schema

ENV PORT=3334

EXPOSE ${PORT}

RUN npm install --production

RUN npm install prisma

RUN npx prisma -v

RUN npx prisma generate --schema ./prisma.schema

CMD node ./main.js
