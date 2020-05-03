FROM node:12.13.1-alpine


RUN mkdir -p /app
WORKDIR /app

COPY . /app

RUN cd common && npm install && npm run build && cd ..
RUN cd ui && npm install && npm run build && cd ..
RUN cd server && npm install && npm run build && cd ..

RUN mv ui/build public
RUN mv server/migrations migrations

CMD [ "node", "server/build/index.js" ]