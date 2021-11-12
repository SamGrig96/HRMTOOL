# build environment
FROM node:12.20.1-alpine3.12

WORKDIR /app

#ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./

RUN yarn && yarn cache clean

COPY . ./

RUN yarn build

RUN yarn global add serve
CMD ["serve", "-s", "build", "-l", "80"]