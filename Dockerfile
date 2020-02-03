FROM node:13

WORKDIR /usr/src/app

RUN npm i -g yarn

COPY package.json ./
COPY yarn.lock ./

RUN yarn
RUN yarn build

COPY . .

EXPOSE 8080

CMD ['node' 'dist/app.js']