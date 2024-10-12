import * as cheerio from "cheerio";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

export class CheerioFetcher implements Fetcher {
  fetch(host: string, url: string): Promise<URL[]> {
    const prisma = new PrismaClient();

    return axios
      .get(url)
      .then((response) => {
        const html = cheerio.load(response.data);
        const title = html("title").text();

        prisma.site_info
          .create({
            data: {
              host: host,
              url: url,
              title: title,
            },
          })
          .then()
          .catch((e) => {});

        const links = html("a[href]")
          .toArray()
          .map((link) => new URL(link.attribs["href"], host));

        return links;
      })
      .catch((e) => {
        return [];
      });
  }
}
