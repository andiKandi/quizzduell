export interface IGameQuestion {
  text: string;
  id: string;
  answers: IAnswer[];
  isDone: boolean;
}

export interface IAnswer {
  text: string;
  isCorrect: boolean;
  playerClickedAnswer: boolean;
}
