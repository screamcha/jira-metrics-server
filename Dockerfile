FROM node:13

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn
RUN yarn build

COPY . .

EXPOSE 8080

CMD ["node", "dist/app.js"]