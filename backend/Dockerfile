FROM node
WORKDIR /home/node/app
COPY . ./
RUN npm i

EXPOSE 3000
CMD ["nodemon","./src/main.ts"]