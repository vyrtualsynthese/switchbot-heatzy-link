##### 💻 DEV #####
FROM node:16-bullseye-slim AS dev

WORKDIR /home/node/app
ENV NODE_ENV development

COPY package*.json ./
RUN npm i --ignore-scripts
COPY . .

CMD ["npm", "run", "dev"]

##### 🏗️ BUILDER #####
FROM dev AS builder

ENV NODE_ENV production

RUN npm run lint &&\
    npm run build &&\
    npm prune --production

##### 🚀 PRODUCTION #####
FROM node:16-bullseye-slim AS prod

WORKDIR /home/node/app
ENV NODE_ENV production

COPY --from=builder /home/node/app/dist /home/node/app/dist

ENTRYPOINT ["node", "./dist/index.js"]
