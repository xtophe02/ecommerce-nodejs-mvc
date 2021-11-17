FROM node:16-slim

# ARG NODE_ENV=development
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

# CMD [ "yarn", "dev" ]
CMD [ "yarn", "start" ]