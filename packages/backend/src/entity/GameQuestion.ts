import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './Question';
import { Answer } from './Answer';
import { Round } from './Round';

@Entity()
export class GameQuestion {
  constructor(round: Round, question: Question) {
    this.round = round;
    this.question = question;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(() => Game, (game) => game.gameQuestions)
  // game: Game;

  @ManyToOne(() => Question, (question) => question.gameQuestions, {
    createForeignKeyConstraints: false,
    eager: true,
  })
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.question.gameQuestions, {
    eager: true,
  })
  @JoinColumn()
  answerCreator: Answer;

  @ManyToOne(() => Answer, (answer) => answer.question.gameQuestions, {
    eager: true,
  })
  @JoinColumn()
  answerOpponent: Answer;

  @ManyToOne(() => Round, (round) => round.gameQuestions)
  round: Round;

  // @Column()
  // isActive: boolean;
}
