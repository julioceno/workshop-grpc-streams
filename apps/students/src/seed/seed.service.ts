import { faker } from '@faker-js/faker';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from '../schemas/student.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(`@services/${SeedService.name}`);
  private readonly maxStudents = 3;
  private readonly schoolsSubjects = [
    'AÇÃO ESTÁ EM SUAS MÃOS',
    'PORTUGUÊS',
    'MATEMÁTICA',
    'PROJETO DE VIDA',
    'O QUE ROLA POR AI',
    'EDUCAÇÃO AMBIETNAL',
    'INGLÊS',
    'ESPANHOL',
    'SOCIOLOGIA',
    'DE OLHO NAS REDES',
  ];

  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,
  ) {}

  onModuleInit() {
    return;
    for (let i = 0; i < this.maxStudents; i++) {
      const schoolSubjects = this.schoolsSubjects.map((name) => ({
        name,
        score: 10,
      }));

      const student = new this.studentModel({
        name: faker.person.fullName(),
        dateOfBirth: faker.date.between({
          from: '2005-01-01',
          to: '2008-12-31',
        }),
        level: faker.number.int({ min: 1, max: 3 }),
        schoolSubjects,
      });

      student.save();
      this.logger.debug(`Estudante adicionado ${i + 1}`);
    }
  }
}
