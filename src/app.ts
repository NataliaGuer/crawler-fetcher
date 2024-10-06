//il manager comunica con i worker node tramite amqp
import { CheerioFetcher } from "./infrastructure/fetcher/cheerioFetcher";
import * as amqp from "amqplib";

const queue = process.env.QUEUE;
const host = "https://en.wikipedia.org/";
const url = "https://en.wikipedia.org/wiki/Portal:Computer_programming";
const fetcher = new CheerioFetcher();

const linksPromise = fetcher.fetch(host, url);

//connection
const channelPromise = amqp.connect(`amqp://${process.env.BROKER}`).then((connection) => {
  return connection.createChannel();
});

Promise.all([linksPromise, channelPromise]).then((values) => {
  const channel = values[1];
  const links = values[0];
  channel.assertQueue(queue);
  links.forEach((link) => channel.sendToQueue(queue, Buffer.from(link)));
});
