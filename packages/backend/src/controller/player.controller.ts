import { Request, Response } from "express";
import { getRepository } from "typeorm";

import { Player } from "../entity/Player";
import { Authentication } from "../middleware/authentication";
import { validate } from "class-validator";

type newFriend = {
  id: string;
  name: string;
};

export const getFriends = async (req: Request, res: Response) => {
  const name = req.params.name;
  const playerRepository = await getRepository(Player);

  try {
    const friends = await playerRepository
      .createQueryBuilder("player")
      .where("player.name like :name", { name: `%${name}%` })
      .getMany();

    const responseFriends = friends.map((f) => {
      return { id: f.id, name: f.name } as newFriend;
    });
    res.status(201).send({ friends: responseFriends });
  } catch (e) {
    res.status(404).send({ status: "not_found" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;
  const playerRepository = await getRepository(Player);

  // Check if user exists
  const player = await playerRepository.findOne({
    where: {
      email,
    },
  });

  if (player) {
    return res.status(400).send({
      status: "bad_request",
    });
  }

  // Generate hashed password
  const hashedPassword: string = await Authentication.hashPassword(password);

  const newPlayer = new Player();
  newPlayer.email = email;
  newPlayer.name = name;
  newPlayer.password = hashedPassword;
  newPlayer.icon = "user";

  const errors = await validate(newPlayer);
  if (errors.length > 0) {
    return res.status(400).send({ status: "bad_request" });
  }

  const createdPlayer = await playerRepository.save(newPlayer);
  createdPlayer.password = "";

  return res.send({
    data: createdPlayer,
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const playerRepository = await getRepository(Player);
  // Check if user exists
  const player = await playerRepository.findOne({
    select: ["password", "email", "name", "id"],
    where: {
      email,
    },
  });

  if (!player) {
    return res.status(401).send({ status: "unauthorized" });
  }

  const matchingPasswords: boolean =
    await Authentication.comparePasswordWithHash(
      password,
      player.password as string
    );
  if (!matchingPasswords) {
    return res.status(401).send({ status: "unauthorized" });
  }

  const token: string = await Authentication.generateToken({
    email: player.email as string,
    id: player.id,
    name: player.name,
  });

  return res.send({
    data: token,
  });
};

export const getPlayerIcon = async (req: Request, res: Response) => {
  const playerId = req.params.id;
  const playerRepo = getRepository(Player);
  const { icon } = await playerRepo.findOneOrFail(playerId);

  res.send(icon);
};

export const setPlayerIcon = async (req: Request, res: Response) => {
  const playerId = req.token!.id;
  const playerRepo = getRepository(Player);
  const player = await playerRepo.findOneOrFail(playerId);
  player.icon = req.body.iconName;

  playerRepo.save(player);

  res.send(player.icon);
};
