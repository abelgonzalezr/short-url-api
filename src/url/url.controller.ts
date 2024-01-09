import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async shortenUrl(@Body() body: { longUrl: string }) {
    const shortUrl = await this.urlService.shortenUrl(body.longUrl);
    return { shortUrl };
  }

  @Get(':shortUrl')
  async getLongUrl(@Param('shortUrl') shortUrl: string) {
    const longUrl = await this.urlService.getLongUrl(shortUrl);
    return { longUrl };
  }
}
