import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Url } from './url.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UrlProcessingService } from './url-processing.service';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<Url>,
    private readonly urlrocessingService: UrlProcessingService,
  ) {}

  async shortenUrl(longUrl: string): Promise<string> {
    const shortUrl = this.generateShortUrl(); //short url generation logic
    const url = new this.urlModel({ shortUrl, longUrl });
    await url.save();
    this.urlrocessingService.processUrl(longUrl); // process url in background
    return shortUrl;
  }

  private generateShortUrl(): string {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const shortUrl = Array.from(
      { length: 6 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
    return shortUrl;
  }

  async getLongUrl(shortUrl: string): Promise<string> {
    const url = await this.urlModel.findOne({ shortUrl });
    if (!url) {
      throw new Error('Url not found');
    }
    url.accessCount++;
    await url.save();
    return url.longUrl;
  }

  async getUrlAndUpdate(shortUrl: string, title: string): Promise<Url> {
    const url = await this.urlModel.findOne({ shortUrl });
    if (!url) {
      throw new Error('Url not found');
    }
    url.title = title;
    await url.save();
    return url;
  }
}
