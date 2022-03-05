import { Entity, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { GameQuestion } from './GameQuestion';
import { Answer } from './Answer';
import { Category } from './Category';

@Entity()
export class Question {
  constructor(text: string, answers: Answer[], category: Category, correctAnswer: Answer) {
    this.text = text;
    this.answers = answers;
    this.category = category;
    this.correctAnswer = correctAnswer;
  }

  @PrimaryColumn()
  text: string;

  @OneToMany(() => Answer, (answer) => answer.question, {
    cascade: false,
    eager: true,
  })
  @JoinTable({ name: 'answer_id' })
  answers: Answer[];

  @ManyToOne(() => Category, (category) => category.questions, {
    createForeignKeyConstraints: false,
  })
  category: Category;

  @OneToOne(() => Answer, { cascade: true })
  @JoinTable({ name: 'correct_answer_id' })
  correctAnswer: Answer;

  @OneToMany(() => GameQuestion, (gameQuestion) => gameQuestion.question, {
    nullable: true,
  })
  gameQuestions: GameQuestion[];
}
