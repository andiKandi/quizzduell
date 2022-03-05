import { Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Question } from './Question';

@Entity()
export class Category {
  constructor(name: string) {
    this.name = name;
  }

  @PrimaryColumn()
  name: string;

  @OneToMany(() => Question, (question) => question.category)
  questions?: Question[];
}
