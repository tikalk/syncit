FROM nikolaik/python-nodejs:python3.10-nodejs18-alpine as Dev
WORKDIR /app
COPY package.json .
COPY .env.example .
RUN yarn install
COPY . .
CMD yarn prepare:db && yarn start