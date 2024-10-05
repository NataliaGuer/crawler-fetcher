import * as cheerio from "cheerio";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

export class CheerioFetcher implements Fetcher {
  fetch(host: string, url: string): void {
    const prisma = new PrismaClient();

    axios.get(url).then((response) => {
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
        .then();

      const links = html("a[href]")
        .toArray()
        .map((link) => link.attribs["href"]);

      console.log(links[0]);
    });
  }
}
