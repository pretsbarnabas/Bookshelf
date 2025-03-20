FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npm install -g ts-node typescript

COPY . ./

ENV DATABASE_URL="temp"
ENV JWT_TOKEN="temp"

EXPOSE 3000

CMD ["ts-node", "src/index.ts"]