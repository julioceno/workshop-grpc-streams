import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProcessorController } from './processor.controller';
import { ProcessorService } from './processor.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'STUDENTS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:8000',
          package: 'students',
          protoPath: join(__dirname, 'proto/students.proto'),
        },
      },
    ]),
  ],
  controllers: [ProcessorController],
  providers: [ProcessorService],
})
export class ProcessorModule {}
