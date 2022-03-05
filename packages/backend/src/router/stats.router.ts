import { Router } from 'express';
import {
  getDashboardStats,
  getGamesRatio,
  getGlobalTopTenPlayers,
  getPlayersPlayedWith,
} from '../controller/stats.controller';

export const statsRouter = Router({ mergeParams: true });
export const initStatsRoutes = () => {
  statsRouter.get('/', getGamesRatio);
  statsRouter.get('/dashboardStats', getDashboardStats);
  statsRouter.get('/topTen', getGlobalTopTenPlayers);
  statsRouter.get('/getOpponentStats', getPlayersPlayedWith);
};
