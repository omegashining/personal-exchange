FROM node:14.17.1
WORKDIR /app

COPY ./package*.json ./
RUN npm ci

# COPY certs* /certs
COPY src ./src
COPY start.sh  ./
RUN chmod +x ./start.sh
CMD ./start.sh

EXPOSE 8080

# docker build . -t xoycoin/xoycoin-exchange
# docker run --name xoycoin-exchange --env-file ./xoycoin_exchange.env -p 8080:8080 --link xoycoin-mysql --link xoycoin-redis xoycoin/xoycoin-exchange

# docker run --name xoycoin-exchange --env-file ./local.env -p 8080:8080 --link xoycoin-mysql --link xoycoin-redis xoycoin/xoycoin-exchange