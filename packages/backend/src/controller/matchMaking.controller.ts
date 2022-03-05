import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Game } from "../entity/Game";
import { MatchMaking } from "../entity/MatchMaking";
import { Player } from "../entity/Player";
import { Round } from "../entity/Round";

type MatchMakingResponse = {
  opponentId: string;
  opponentName: string;
};

export const getRandomPlayer = async (req: Request, res: Response) => {
  const playerId = req.params.id;
  try {
    const matchMakingRepository = await getRepository(MatchMaking);
    const playerRepository = await getRepository(Player);

    const randomPlayer = await matchMakingRepository
      .createQueryBuilder("player")
      .orderBy("RAND()")
      .limit(1)
      .getOne();

    if (!randomPlayer) {
      const newMatch = new MatchMaking();
      newMatch.playerId = playerId;
      const addedPlayer = matchMakingRepository.save(newMatch);
      return res.status(201).send({
        data: addedPlayer,
      });
    }
    {
      const newGame = new Game();
      newGame.opponent = (await playerRepository.findOne(playerId)) as Player;
      newGame.creator = (await playerRepository.findOne(
        randomPlayer.playerId
      )) as Player;

      newGame.rounds = [];

      for (let i = 0; i < 4; i++) {
        const round = new Round(i + 1, i === 0, newGame, "", i % 2 === 0);
        newGame.rounds.push(round);
      }

      const gameRepository = await getRepository(Game);
      const createdGame = await gameRepository.save(newGame);
      createdGame.opponent.name;
      await matchMakingRepository.delete(randomPlayer.id);

      const responseData: MatchMakingResponse = {
        opponentId: createdGame.creator.id,
        opponentName: createdGame.creator.name,
      };

      return res.status(201).send({ data: responseData });
    }
  } catch (error) {
    return res.status(400).send({
      status: "bad_request",
    });
  }
};

export const checkState = async (req: Request, res: Response) => {
  const playerId = req.params.id;
  let state = "";
  try {
    const matchMakingRepository = await getRepository(MatchMaking);

    const player = await matchMakingRepository
      .createQueryBuilder("match")
      .where("playerId = :playerId", { playerId })
      .getOne();

    if (player) {
      state = "not_yet";
    } else {
      state = "found";
    }

    return res.status(201).send({
      status: state,
    });
  } catch (error) {
    return res.status(400).send({
      status: "bad_request",
    });
  }
};

export const deleteMatchMaking = async (req: Request, res: Response) => {
  const playerId = req.params.id;
  try {
    const matchMakingRepository = await getRepository(MatchMaking);
    await matchMakingRepository
      .createQueryBuilder("match")
      .delete()
      .where("playerId = :playerId", { playerId })
      .execute();

    return res.status(201).send({
      status: "OK",
    });
  } catch (error) {
    return res.status(400).send({
      status: "bad_request",
    });
  }
};
