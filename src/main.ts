import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://bod-test-task-client-8nnkl5n9w-owais-projects-7419f1cc.vercel.app/', // your frontend URL
    credentials: true,
  });
  await app.listen(4000);
}
bootstrap();
