FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

WORKDIR /app/client

RUN npm install

RUN npm install react-scripts -g

EXPOSE 3000

CMD ["npm", "run", "start"]