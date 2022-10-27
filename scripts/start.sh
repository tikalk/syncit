#!/bin/sh
set -x

npx prisma migrate deploy --schema /syncit/libs/models/src/prisma/schema.prisma
yarn start
