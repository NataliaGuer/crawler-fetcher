//il manager comunica con i worker node tramite amqp
import { CheerioFetcher } from "./infrastructure/fetcher/cheerioFetcher";
import * as amqp from "amqplib";

console.log("fetcher started");

const pushQueue = process.env.BROKER_QUEUE;
const pullQueue = process.env.FETCHER_QUEUE;
const fetcher = new CheerioFetcher();

//connection
const channelPromise = amqp.connect(process.env.MESSAGE_QUEUE).then((connection) => {
  return connection.createChannel();
});

channelPromise.then((channel) => {
  channel.assertQueue(pullQueue);
  channel.consume(pullQueue, (msg) => {
    const job = JSON.parse(msg.content.toString());

    fetcher.fetch(job["host"], job["url"]).then((links) => {
      channel.assertQueue(pushQueue);
      links.forEach((link) => {
        const msg = {
          host: link.origin,
          url: link.href,
        };
        channel.sendToQueue(pushQueue, Buffer.from(JSON.stringify(msg)));
      });
    });
  });
});
