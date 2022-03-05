import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './Question';

@Entity()
export class Answer {
  constructor(text: string, isCorrect: boolean) {
    this.text = text;
    this.isCorrect = isCorrect;
  }

  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Question, (question) => question.answers, {
    createForeignKeyConstraints: false,
  })
  question: Question;

  @Column()
  text: string;

  @Column()
  isCorrect: boolean;
}
