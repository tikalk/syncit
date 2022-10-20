FROM nikolaik/python-nodejs:python3.10-nodejs18-alpine as Dev
WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
CMD yarn prisma:migrate && yarn prisma:generate && yarn prisma:push && yarn start