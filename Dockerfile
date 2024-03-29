FROM node:latest

WORKDIR /app

COPY . . 

RUN yarn 

ENTRYPOINT bash -c "npx prisma migrate dev --name 'intialized db'; yarn dev"
