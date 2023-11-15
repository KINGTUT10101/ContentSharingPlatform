FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN cd client

RUN npm install

RUN npx react-scripts build

EXPOSE 5000

CMD ["npm", "run", "dev"]