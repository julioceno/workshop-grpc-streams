import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongoSchema } from 'mongoose';

class SchoolSubject {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  score: number;
}

@Schema({ _id: true })
export class Student {
  @Prop({ required: true, type: MongoSchema.Types.String })
  name: string;

  @Prop({ required: true, type: MongoSchema.Types.Date })
  dateOfBirth: Date;

  @Prop({ required: true, type: MongoSchema.Types.Number })
  level: number;

  @Prop({ required: true, type: [SchoolSubject] })
  schoolSubjects: SchoolSubject[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
