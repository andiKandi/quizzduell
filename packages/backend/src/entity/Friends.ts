import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ownId: string;

  @Column()
  friendId: string;

  constructor(ownId: string, friendId: string) {
    this.ownId = ownId;
    this.friendId = friendId;
  }
}
