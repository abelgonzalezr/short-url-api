import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { UrlService } from './url.service';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class UrlProcessingService {
  constructor(
    @InjectQueue('url-processing') private readonly queue: Queue,
    private readonly urlService: UrlService,
  ) {}
  async processUrl(shortUrl: string, longUrl: string): Promise<void> {
    console.log(`Adding url ${longUrl} to queue`);
    await this.queue.add('process-url', { shortUrl, longUrl }, { priority: 1 });
  }

  async handleUrlProcessing(jobData: {
    shortUrl: string;
    longUrl: string;
  }): Promise<void> {
    const { longUrl, shortUrl } = jobData;
    axios.get(longUrl).then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const title = $('title').text();
      this.urlService.getUrlAndUpdate(shortUrl, title);
      console.log(`Processing url ${longUrl} with title ${title}`);
    });
  }
}
