FROM node:20-alpine

# Install RabbitMQ dependencies and RabbitMQ itself
RUN apk add erlang rabbitmq-server

RUN mkdir -p home/app
RUN chown -R node:node /home/app
USER node

COPY . /home/app
WORKDIR /home/app
RUN npm install
RUN npx tsc

# Expose the RabbitMQ default ports (5672 for messaging, 15672 for management UI)
EXPOSE 5672 15672

# Start RabbitMQ in the background and your Node.js app
CMD rabbitmq-server start & tail -f /dev/null

# CMD ["node", "dist/app.js"]
