import { getRepository, Repository } from 'typeorm';
import { RequestHandler } from 'express';
import { Game } from '../entity/Game';
import { Player } from '../entity/Player';
import { Round } from '../entity/Round';

type PlayerStats = {
  wins: number;
  losses: number;
  draws: number;
};

type DashboardStats = {
  gamesPlayed: number;
  eloRanking: number;
  bestCategory: string;
  winRatio: number;
};

type OpponentMap = {
  name: string;
  games: number;
};

export const getDashboardStats: RequestHandler<{}, DashboardStats> = async (req, res) => {
  const { playerId } = req.query;
  const gameRepository: Repository<Game> = getRepository(Game);
  const playerRepository: Repository<Player> = getRepository(Player);
  const roundRepository: Repository<Round> = getRepository(Round);

  const allGames: number = await gameRepository
    .createQueryBuilder('Game')
    .where('(Game.opponentId= :playerId OR  Game.creatorId= :playerId)', {
      playerId,
    })
    .andWhere('Game.gameWinner IS NOT NULL')
    .getCount();

  const player = await playerRepository
    .createQueryBuilder('Player')
    .where('Player.id= :playerId', { playerId })
    .getOne();

  const gamesAsWinner: number = await gameRepository.count({
    where: { gameWinner: playerId },
  });
  const winRatio: number = Number((gamesAsWinner / allGames).toPrecision(2)) * 100;

  const bestCategory: string = await roundRepository.query(`select categoryName from round
  where roundWinnerId= '${playerId}'
  group by categoryName
  order by count(*) desc
  limit 1;`);

  try {
    res.status(200).send({
      gamesPlayed: allGames,
      eloRanking: player?.eloRanking!,
      bestCategory,
      winRatio,
    });
  } catch (e) {
    res.status(404).send();
  }
};

export const getGamesRatio: RequestHandler<{}, PlayerStats> = async (req, res) => {
  const { playerId } = req.query;
  const gameRepository: Repository<Game> = getRepository(Game);

  const allGames: number = await gameRepository
    .createQueryBuilder('Game')
    .where('Game.opponentId= :playerId OR  Game.creatorId= :playerId', {
      playerId,
    })
    .getCount();

  const gamesAsWinner: number = await gameRepository.count({
    where: { gameWinner: playerId },
  });

  const drawGames: number = await gameRepository
    .createQueryBuilder('Game')
    .where('(Game.opponentId = :playerId OR  Game.creatorId = :playerId) AND Game.gameWinner = :draw', {
      playerId,
      draw: 'draw',
    })
    .getCount();

  const losses = allGames - gamesAsWinner - drawGames;
  try {
    res.status(201).send({ wins: gamesAsWinner, losses, draws: drawGames });
  } catch (e) {
    res.status(404).send();
  }
};

export const getPlayersPlayedWith: RequestHandler<{}, any> = async (req, res) => {
  const { playerId } = req.query;
  const gameRepository: Repository<Game> = getRepository(Game);

  const allGames: Game[] = await gameRepository
    .createQueryBuilder('Game')
    .innerJoinAndSelect('Game.opponent', 'opponent')
    .innerJoinAndSelect('Game.creator', 'creator')
    .where('Game.opponentId= :playerId OR  Game.creatorId= :playerId', {
      playerId,
    })
    .getMany();

  const opponentNames: string[] = allGames.map((game) => {
    if (playerId === game.creator.id) return game.opponent.name;
    return game.creator.name;
  });

  const mappedOpponents: any = opponentNames.reduce(function (p: any, c: any) {
    p[c] = (p[c] || 0) + 1;
    return p;
  }, {});

  const opponentMaps: OpponentMap[] = [];

  Object.entries(mappedOpponents).forEach(([key, value]) => {
    const opp: OpponentMap = { name: key, games: value as number };
    opponentMaps.push(opp);
  });
  try {
    res.status(201).send(opponentMaps);
  } catch (e) {
    res.status(404).send();
  }
};

export const getGlobalTopTenPlayers: RequestHandler<{}, Player[]> = async (_, res) => {
  const playerRepository: Repository<Player> = getRepository(Player);
  const topTen: Player[] = await playerRepository
    .createQueryBuilder('Player')
    .orderBy('Player.eloRanking', 'DESC')
    .limit(10)
    .getMany();

  try {
    res.status(200).send(topTen);
  } catch (e) {
    res.status(404).send();
  }
};
