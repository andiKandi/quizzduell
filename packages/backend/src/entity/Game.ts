import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './Player';
import { Round } from './Round';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Player, { eager: true })
  creator: Player;

  @ManyToOne(() => Player, { eager: true })
  opponent: Player;

  @OneToMany(() => Round, (round) => round.game, { cascade: true })
  rounds: Round[];

  @Column({ nullable: true })
  gameWinner: string;

  @Column({ default: false })
  isGameOver: boolean;
}
