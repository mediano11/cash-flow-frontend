FROM node:16-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE ${UI_PORT}

CMD ["npm", "start"]