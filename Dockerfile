FROM node:20-alpine

RUN mkdir -p home/app

COPY . /home/app
WORKDIR /home/app
RUN npm install
RUN npx tsc

CMD npm install & npx tsc & node dist/app.js

# CMD ["node", "dist/app.js"]
