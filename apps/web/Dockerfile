FROM node:lts-alpine
RUN apk add --no-cache python3 g++ make
WORKDIR /app
COPY ./dist/apps/web .
ENV PORT=4200
EXPOSE ${PORT}
RUN yarn install --production --frozen-lockfile
CMD yarn start
