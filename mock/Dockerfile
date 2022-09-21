##### 💻 DEV #####
FROM node:alpine

WORKDIR /home/node/app
ENV NODE_ENV development

COPY package*.json ./
RUN npm i --ignore-scripts
COPY . .

CMD ["npm", "run", "mocks"]
