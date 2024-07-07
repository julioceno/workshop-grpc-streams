import { Observable } from 'rxjs';

export interface GrpcStudentsService {
  GetStudents(): Observable<GetStudentsResponse>;
}

export interface GetStudentsResponse {
  students: Student[];
}

export interface Student {
  _id: string;
  name: string;
  dateOfBirth: string;
  level: number;
  schoolSubjects: SchoolSubject[];
}

export interface SchoolSubject {
  name: string;
  score: number;
}
