FROM node:20-alpine
RUN mkdir -p home/app
COPY . /home/app
WORKDIR /home/app
RUN npm install
RUN npx tsc
CMD ["node", "dist/app.js"]
