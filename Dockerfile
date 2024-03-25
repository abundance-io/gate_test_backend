FROM node:latest

WORKDIR /app

COPY . . 

RUN yarn 

ENTRYPOINT yarn dev
