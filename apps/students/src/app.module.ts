import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeedModule } from './seed/seed.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [SeedModule, StudentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
