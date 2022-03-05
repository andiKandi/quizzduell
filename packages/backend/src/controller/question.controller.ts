import { getRepository } from 'typeorm';
import { Question } from '../entity/Question';
import { Request, Response } from 'express';
import { GameQuestion } from '../entity/GameQuestion';
import { Answer } from '../entity/Answer';
import { Round } from '../entity/Round';

interface ICreateGameQuestionRequestBody {
  gameId: string;
  category: string;
  roundId: string;
}

export interface ICreateGameQuestionResponseBody {
  text: string;
  id: string;
  answers: IAnswerResponse[];
  isDone: boolean;
}

export interface IAnswerResponse {
  text: string;
  isCorrect: boolean;
  playerClickedAnswer: boolean;
}

export const createGameQuestion = async (req: Request, res: Response) => {
  const body = req.body.body as ICreateGameQuestionRequestBody;
  const gameQuestionRepo = getRepository(GameQuestion);
  const roundRepo = getRepository(Round);
  const questionRepo = getRepository(Question);
  try {
    const questionText = await questionRepo
      .createQueryBuilder('question')
      .where('question.category = :category', { category: body.category })
      .orderBy('RAND()')
      .limit(4)
      .getMany();
    const round = await roundRepo.findOneOrFail(body.roundId);
    round.categoryName = body.category;
    await roundRepo.save(round);
    const reponse: ICreateGameQuestionResponseBody[] = [];

    for (let i = 0; i < 4; ++i) {
      const responseQuestion = questionText[i];
      const answers: Answer[] = await findAnswersByQuestion(responseQuestion.text);

      const gameQuestion = new GameQuestion(round, responseQuestion);
      await gameQuestionRepo.save(gameQuestion);
      reponse.push({
        id: gameQuestion.id,
        text: responseQuestion.text,
        isDone: false,
        answers: answers.map((elem): IAnswerResponse => {
          return {
            text: elem.text,
            isCorrect: elem.isCorrect,
            playerClickedAnswer: false,
          };
        }),
      });
    }

    res.status(200).send({ data: reponse });
  } catch {
    res.status(404).send('Could not find a suitable question');
  }
};

const findAnswersByQuestion = (questionText: string) => {
  const queryText = `select * from answer where answer.questionText like '%${questionText}%'`;
  const answerRepo = getRepository(Answer);
  return answerRepo.query(queryText);
};

export const getRoundQuestions = async (req: Request, res: Response) => {
  const roundId = req.params.roundId;
  // const round = round;
  const gameQuestionRepo = getRepository(GameQuestion);
  try {
    const questions = await gameQuestionRepo.find({
      where: { round: roundId },
    });

    const response = questions.map((q) => {
      return {
        id: q.id,
        text: q.question.text,
        isDone: false,
        answers: q.question.answers.map((elem): IAnswerResponse => {
          return {
            text: elem.text,
            isCorrect: elem.isCorrect,
            playerClickedAnswer: false,
          };
        }),
      };
    });
    res.status(200).send({ data: response });
  } catch (e) {
    console.log(e);
    res.status(404).send('Could not Game Questions');
  }
};
