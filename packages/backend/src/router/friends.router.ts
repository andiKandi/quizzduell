import { Router } from 'express';

import { addFriend, getFriendsList, removeFriend } from '../controller/friend.controller';

export const friendRouter = Router({ mergeParams: true });

export const initFriendRoutes = () => {
  friendRouter.get('/:id', getFriendsList);
  friendRouter.post('/:ownId/:newId', addFriend);
  friendRouter.delete('/:ownId/:newId', removeFriend);
};
