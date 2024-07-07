import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GetStudentsResponse, GrpcStudentsService } from './types';

@Injectable()
export class ProcessorService implements OnModuleInit {
  private readonly logger = new Logger(`@services/${ProcessorService.name}`);
  private studentsService: GrpcStudentsService;

  constructor(
    @Inject('STUDENTS_PACKAGE')
    private readonly clientGrpc: ClientGrpc,
  ) {}

  onModuleInit() {
    this.studentsService = this.clientGrpc.getService('StudentsService');
  }

  async run() {
    const logger = this.logger;
    const next = this.next;
    const calculateTotal = this.calculateTotal;

    const accumulator: Record<
      string,
      Record<string, { totalScore: number; count: number }>
    >[] = [];

    const getStudentsStream = this.studentsService.GetStudents();
    getStudentsStream.subscribe({
      next(items) {
        const value = next(items);
        accumulator.push(value);
      },
      error() {
        logger.error('Ocorreu um erro');
      },
      complete() {
        logger.log('Processamento Concluido');
        calculateTotal(accumulator);
      },
    });
  }

  private next(getStudentsResponse: GetStudentsResponse) {
    const value = getStudentsResponse.students.reduce(
      (accumulator, current) => {
        const { level, schoolSubjects } = current;

        if (!accumulator[level]) {
          accumulator[level] = {};
        }

        schoolSubjects.forEach(({ name, score }) => {
          if (!accumulator[level][name]) {
            accumulator[level][name] = { totalScore: score, count: 1 };
            return;
          }

          accumulator[level][name].totalScore += score;
          accumulator[level][name].count += 1;
        });

        return accumulator;
      },
      {},
    );

    return value;
  }

  private calculateTotal(
    items: Record<
      string,
      Record<string, { totalScore: number; count: number }>
    >[],
  ) {
    const value = items.reduce((accumulator, current) => {
      const levelsArray = Object.entries(current);
      levelsArray.forEach(([level, schoolSubjects]) => {
        if (!accumulator[level]) {
          accumulator[level] = {};
        }

        const schoolsSubjectsArray = Object.entries(schoolSubjects);
        schoolsSubjectsArray.forEach(([schoolSubjectName, value]) => {
          if (!accumulator[level][schoolSubjectName]) {
            accumulator[level][schoolSubjectName] = {
              totalScore: value.totalScore,
              count: value.count,
            };

            return;
          }

          accumulator[level][schoolSubjectName].totalScore += value.totalScore;
          accumulator[level][schoolSubjectName].count += value.count;
        });
      });

      return accumulator;
    }, {});

    const averageScore = Object.entries(value).reduce(
      (accumulator, current) => {
        const [level, schoolsSubjects] = current;
        const schoolsSubjectsArray = Object.entries(schoolsSubjects);

        schoolsSubjectsArray.forEach(([schoolsSubjectName, value]) => {
          if (!accumulator[level]) {
            accumulator[level] = {};
          }

          const totalScore = (value.totalScore / value.count).toFixed(2);
          accumulator[level][schoolsSubjectName] = totalScore;
        });

        return accumulator;
      },
      {},
    );

    console.log(averageScore);
  }
}
