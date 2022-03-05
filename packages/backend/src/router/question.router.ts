import { Router } from 'express';
import { createGameQuestion, getRoundQuestions } from '../controller/question.controller';

export const questionRouter = Router({ mergeParams: true });

export const initQuestionRoutes = () => {
  questionRouter.post('/', createGameQuestion);
  questionRouter.get('/:roundId', getRoundQuestions);
};
