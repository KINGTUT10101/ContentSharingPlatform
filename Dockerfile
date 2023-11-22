FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

WORKDIR /app/client

RUN npm install

RUN npm install react-scripts -g

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "dev"]