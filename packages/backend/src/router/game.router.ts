import { Router } from 'express';
import {
  createGame,
  deleteGame,
  getAllGames,
  getCategoriesSelection,
  getGame,
  submitAnswer,
  updateGame,
} from '../controller/game.controller';

export const gameRouter = Router({ mergeParams: true });

export const initGameRoutes = () => {
  gameRouter.get('/categories', getCategoriesSelection);
  gameRouter.post('/', createGame);
  gameRouter.get('/', getAllGames);
  gameRouter.get('/:id', getGame);
  gameRouter.put('/:id', updateGame);
  gameRouter.delete('/:id', deleteGame);
  gameRouter.post('/gameanswer', submitAnswer);
};
