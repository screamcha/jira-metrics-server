FROM node:13

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .
RUN yarn build

EXPOSE 80

CMD ["node", "dist/app.js"]