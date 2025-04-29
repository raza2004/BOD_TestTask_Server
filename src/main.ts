import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://bod-test-task-client.vercel.app', // your frontend URL
    credentials: true,
  });
  const port = process.env.PORT || 8000;
 
  await app.listen(port);
}
bootstrap();
