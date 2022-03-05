import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MatchMaking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  playerId: string;
}
