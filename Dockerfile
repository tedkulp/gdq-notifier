FROM node

RUN mkdir /myapp
WORKDIR /myapp

COPY package.json .
COPY yarn.lock .

RUN yarn install

ADD . /myapp

CMD ["yarn", "start"]
