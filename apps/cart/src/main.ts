import { NestFactory } from '@nestjs/core';
import { CartModule } from './cart.module';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(CartModule);
  const configService = app.get(ConfigService);
  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET') || 'default_secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(process.env.port ?? 3003, '0.0.0.0');
}
bootstrap();
