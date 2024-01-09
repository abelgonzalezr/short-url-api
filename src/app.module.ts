import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlController } from './url/url.controller';
import { UrlService } from './url/url.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlSchema } from './url/url.schema';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { BullModule } from '@nestjs/bull';
import { UrlProcessingService } from './url/url-processing.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(configuration().database.url),
    MongooseModule.forFeature([{ name: 'Url', schema: UrlSchema }]),
    BullModule.forRoot({
      redis: {
        host: configuration().redis.host,
        port: configuration().redis.port,
      },
    }),
    BullModule.registerQueue({
      name: 'url-processing',
    }),
  ],
  controllers: [AppController, UrlController],
  providers: [AppService, UrlService, UrlProcessingService],
})
export class AppModule {}
