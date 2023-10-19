import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

import * as dotenv from 'dotenv';

dotenv.config();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();

const server = express();

export const createNestServer = async (expressInstance: any) => {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  return app.init();
};

createNestServer(server);

export const api = server;
