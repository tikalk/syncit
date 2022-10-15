FROM node:16 as builder

ARG DATABASE_URL
ARG NEXT_PUBLIC_WEBAPP_URL
ARG SECRET
ARG MAX_OLD_SPACE_SIZE=4096
# todo: add missing envs

ENV DATABASE_URL=$DATABASE_URL \
    NEXT_PUBLIC_WEBAPP_URL=$NEXT_PUBLIC_WEBAPP_URL \
    SECRET=$SECRET \
    NODE_OPTIONS=--max-old-space-size=${MAX_OLD_SPACE_SIZE}
# todo: add missing envs

WORKDIR /syncit
COPY package.json yarn.lock ./
COPY .env .env.example ./
COPY apps/web ./apps/web
COPY apps/be ./apps/be
COPY libs ./packages

RUN yarn config set network-timeout 1000000000 -g && \
    yarn install --frozen-lockfile

RUN yarn build

FROM node:16 as runner

WORKDIR /syncit
ENV NODE_ENV production

RUN apt-get update && \
    apt-get -y install netcat && \
    rm -rf /var/lib/apt/lists/* && \
    npm install --global prisma nx

COPY package.json yarn.lock ./
COPY --from=builder /syncit/node_modules ./node_modules
COPY --from=builder /syncit/libs ./libs
COPY --from=builder /syncit/apps/web ./apps/web
COPY --from=builder /syncit/apps/be ./apps/be
COPY --from=builder /syncit/libs/models/src/prisma/schema.prisma ./prisma/schema.prisma
COPY scripts scripts

ENTRYPOINT ["/syncit/scripts/start.sh"]
