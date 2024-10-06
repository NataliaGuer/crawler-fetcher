interface Fetcher {
  fetch(host: string, url: string): Promise<string[]>;
}
