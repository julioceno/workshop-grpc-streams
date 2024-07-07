import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { Student } from '../schemas/student.schema';

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(`@services/${StudentsService.name}`);

  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,
  ) {}

  async run() {
    const studentCursor = this.studentModel.find().cursor();

    const observable = new Observable((subscribe) => {
      let students = [];

      studentCursor.on('data', (student) => {
        students.push(student);

        if (students.length > 1) {
          subscribe.next({ students });
          students = [];
        }
      });

      studentCursor.on('end', () => {
        if (students.length > 0) {
          subscribe.next({ students });
          students = [];
        }

        subscribe.complete();
      });

      studentCursor.on('error', () => {
        this.logger.error('Ocorreu um erro');
        students = [];
        subscribe.error();
      });

      return () => {
        if (!studentCursor.closed) {
          studentCursor.close();
        }
      };
    });

    return observable;
  }
}
