import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './Game';
import { GameQuestion } from './GameQuestion';

@Entity()
export class Round {
  constructor(roundNumber: number, isActive: boolean, game: Game, roundWinnerId: string, creatorIsPlaying: boolean) {
    this.roundNumber = roundNumber;
    this.isActive = isActive;
    this.game = game;
    this.roundWinnerId = roundWinnerId;
    this.creatorIsPlaying = creatorIsPlaying;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roundNumber: number;

  @Column({ nullable: true })
  categoryName: string;

  @OneToMany(() => GameQuestion, (gameQuestion) => gameQuestion.round, {
    nullable: true,
    eager: true,
  })
  gameQuestions?: GameQuestion[];

  @ManyToOne(() => Game, (game) => game.rounds, { eager: true })
  game: Game;

  @Column()
  isActive: boolean;

  @Column()
  creatorIsPlaying: boolean;

  @Column({ nullable: true })
  roundWinnerId: string;
}
