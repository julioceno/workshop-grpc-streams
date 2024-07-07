import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: 'localhost:8000',
      package: 'students',
      protoPath: join(__dirname, 'proto/students.proto'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(3030);
}
bootstrap();
