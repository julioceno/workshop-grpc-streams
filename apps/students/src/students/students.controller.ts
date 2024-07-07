import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @GrpcMethod('StudentsService', 'GetStudents')
  getStudents() {
    return this.studentsService.run();
  }
}
