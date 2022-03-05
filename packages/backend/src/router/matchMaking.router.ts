import { Router } from 'express';
import { checkState, deleteMatchMaking, getRandomPlayer } from '../controller/matchMaking.controller';

export const matchMakingRouter = Router({ mergeParams: true });

export const initMatchMakingRoutes = () => {
  matchMakingRouter.get('/:id', getRandomPlayer);
  matchMakingRouter.delete('/:id', deleteMatchMaking);
  matchMakingRouter.get('/checkState/:id', checkState);
};
