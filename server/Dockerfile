FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

WORKDIR /app/server

RUN npm install

EXPOSE 5000

CMD ["npm", "run", "server"]