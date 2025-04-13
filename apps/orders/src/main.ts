import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
    const configService = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
