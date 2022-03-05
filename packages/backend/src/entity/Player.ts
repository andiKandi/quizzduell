import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';
import { Game } from './Game';
// import { Game } from "./Game";

@Entity()
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsEmail()
  email?: string;

  @Column()
  password?: string;

  @Column()
  @MinLength(3, {
    message: 'Name is too short',
  })
  name: string;

  @Column()
  icon: string;

  @CreateDateColumn()
  createdAt?: string;

  @UpdateDateColumn()
  updatedAt?: string;

  @OneToMany(() => Game, (game) => game.creator)
  createdGames?: Game[];

  @OneToMany(() => Game, (game) => game.opponent)
  opponentInGames?: Game[];

  @Column({ default: 1000 })
  eloRanking: number;
}
