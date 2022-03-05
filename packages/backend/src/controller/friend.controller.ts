import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Friend } from '../entity/Friends';

export const addFriend = async (req: Request, res: Response) => {
  const ownId = req.params.ownId;
  const newId = req.params.newId;
  try {
    const friendRepository = await getRepository(Friend);

    const newFriend = await friendRepository.save([new Friend(ownId, newId), new Friend(newId, ownId)]);

    return res.status(201).send({ data: newFriend });
  } catch (error) {
    return res.status(400).send({
      status: 'bad_request',
    });
  }
};

export const getFriendsList = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const friendRepository = await getRepository(Friend);
    const friendList = await friendRepository.query(
      `select p.name, p.id from friend f join player p on f.friendId = p.id where f.ownId = '${id}';`,
    );

    return res.status(201).send({
      data: friendList,
    });
  } catch (error) {
    return res.status(400).send({
      status: 'bad_request',
    });
  }
};

export const removeFriend = async (req: Request, res: Response) => {
  const ownId = req.params.ownId;
  const friendId = req.params.newId;
  try {
    const friendRepository = await getRepository(Friend);
    await friendRepository
      .createQueryBuilder('friend')
      .delete()
      .where('friend.ownId = :ownId', { ownId })
      .andWhere('friend.friendId = :friendId', { friendId })
      .execute();

    await friendRepository
      .createQueryBuilder('friend')
      .delete()
      .where('friend.ownId = :friendId', { friendId })
      .andWhere('friend.friendId = :ownId', { ownId })
      .execute();

    return res.status(201).send({
      status: 'ok',
    });
  } catch (error) {
    return res.status(400).send({
      status: 'bad_request',
    });
  }
};
