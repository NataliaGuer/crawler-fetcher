//il manager comunica con i worker node tramite amqp
import { CheerioFetcher } from "./infrastructure/fetcher/cheerioFetcher";

const host = "https://en.wikipedia.org/";
const url = "https://en.wikipedia.org/wiki/Portal:Computer_programming";
const fetcher = new CheerioFetcher();
fetcher.fetch(host, url);
