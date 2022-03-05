import { Router } from 'express';

import { getFriends, getPlayerIcon, loginUser, registerUser, setPlayerIcon } from '../controller/player.controller';

export const userRouter = Router({ mergeParams: true });

export const initUserRoutes = () => {
  userRouter.post('/', registerUser);
  userRouter.post('/token', loginUser);
  userRouter.get('/getFriends/:name', getFriends);
  userRouter.get('/:id/icon', getPlayerIcon);
  userRouter.put('/icon', setPlayerIcon);
};
