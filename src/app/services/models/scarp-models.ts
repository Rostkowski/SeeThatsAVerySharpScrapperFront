export interface ScrappedDataResponse {
  scrapedData: any;
}

export interface ScrapDataRequest {
  urls: string[];
  cssSelectors: { [key: string]: string };
}
