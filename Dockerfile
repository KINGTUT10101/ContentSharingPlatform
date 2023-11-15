FROM node:20

WORKDIR /app

COPY package*.json ./

RUN NODE_ENV=development npm install

COPY . .

RUN cd client

RUN NODE_ENV=development npm install

RUN cd ..

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "dev"]