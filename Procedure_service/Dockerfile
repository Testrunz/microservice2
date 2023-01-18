FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 2000
CMD [ "node", "index.js" ]