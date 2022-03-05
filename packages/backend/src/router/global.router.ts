import { Request, Response, Router } from 'express';

// import { Authentication } from '../middleware/authentication';
import { initUserRoutes, userRouter } from './user.router';
import { initQuestionRoutes, questionRouter } from './question.router';
import { gameRouter, initGameRoutes } from './game.router';
import { initFriendRoutes, friendRouter } from './friends.router';
import { initMatchMakingRoutes, matchMakingRouter } from './matchMaking.router';
import { initStatsRoutes, statsRouter } from './stats.router';

export const globalRouter = Router({ mergeParams: true });

export const initGlobalRoutes = () => {
  globalRouter.get('/', async (_: Request, res: Response) => {
    res.send({ message: 'Hello api' });
  });

  // globalRouter.use('/transaction', Authentication.verifyAccess, transactionRouter);
  globalRouter.use('/friends', friendRouter);
  globalRouter.use('/user', userRouter);
  globalRouter.use('/game', gameRouter);
  globalRouter.use('/question', questionRouter);
  globalRouter.use('/matchMaking', matchMakingRouter);
  globalRouter.use('/stats', statsRouter);
  initUserRoutes();
  initQuestionRoutes();
  initGameRoutes();
  initFriendRoutes();
  initMatchMakingRoutes();
  initStatsRoutes();
};
