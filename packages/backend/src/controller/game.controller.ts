import { Request, RequestHandler, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { Answer } from '../entity/Answer';
import { Game } from '../entity/Game';
import { GameQuestion } from '../entity/GameQuestion';
import { Player } from '../entity/Player';
import { Round } from '../entity/Round';
import { categoriesList } from '../fixture/CategoriesList';
import { Authentication, JWTToken } from '../middleware/authentication';
import { IAnswerResponse, ICreateGameQuestionResponseBody } from './question.controller';

type GetAllGames = {
  games: Game[];
};

type GetGame = {
  game: Game;
};

type CreateGame = {
  createdGame: Game;
};

type UpdateGame = {
  updatedGame: Game;
};

function filterPlayer(player: Player): Player {
  delete player.createdAt;
  delete player.updatedAt;
  delete player.password;
  delete player.email;
  delete player.opponentInGames;
  delete player.createdGames;

  return player;
}

function filterRound(round: Round): Round {
  delete round.gameQuestions;

  return round;
}

export const getAllGames: RequestHandler<{}, GetAllGames> = async (req, res) => {
  const gameRepository: Repository<Game> = await getRepository(Game);
  const { creatorId } = req.query;

  const games = await gameRepository
    .createQueryBuilder('game')
    .leftJoinAndSelect('game.rounds', 'round')
    .leftJoinAndSelect('game.creator', 'creator')
    .leftJoinAndSelect('game.opponent', 'opponent')
    .where('game.creator = :creatorId', { creatorId })
    .orWhere('game.opponent = :creatorId', { creatorId })
    .getMany();
  const filteredGames = games.map((g) => {
    g.rounds = g.rounds.map((g) => filterRound(g)).sort((a, b) => a.roundNumber - b.roundNumber);
    g.creator = filterPlayer(g.creator);
    g.opponent = filterPlayer(g.opponent);
    return g;
  });
  res.send({
    games: filteredGames,
  });
};

export const getGame: RequestHandler<{ id: string }, GetGame> = async (req: Request, res: Response) => {
  const gameId = req.params.id;
  const gameRepository: Repository<Game> = getRepository(Game);
  try {
    const game: Game = await gameRepository.findOneOrFail(gameId);
    res.status(200).send(game);
  } catch (e) {
    res.status(404).send();
  }
};

export const createGame: RequestHandler<{}, CreateGame> = async (req: Request, res: Response) => {
  const playerRepository: Repository<Player> = await getRepository(Player);
  const { creatorId, opponentId } = req.body;

  const newGame = new Game();
  newGame.creator = (await playerRepository.findOne(creatorId)) as Player;
  newGame.opponent = (await playerRepository.findOne(opponentId)) as Player;
  newGame.rounds = [];

  for (let i = 0; i < 4; i++) {
    const round = new Round(i + 1, i === 0, newGame, '', i % 2 === 0);
    newGame.rounds.push(round);
  }

  const gameRepository = await getRepository(Game);
  await gameRepository.save(newGame);
  try {
    res.status(201).send('Successfully created Game');
  } catch (e) {
    console.log(e);
    res.status(404).send();
  }
};

export const updateGame: RequestHandler<{ id: string }, UpdateGame> = async (req: Request, res: Response) => {
  const gameId = req.params.id;
  const { gameWinner } = req.body;
  const gameRepository = await getRepository(Game);
  try {
    let updatetGame: Game = await gameRepository.findOneOrFail(gameId);
    updatetGame.gameWinner = gameWinner;
    updatetGame = await gameRepository.save(updatetGame);

    res.status(200).send(updatetGame);
  } catch (e) {
    res.status(404).send();
  }
};

export const deleteGame: RequestHandler<{ id: string }> = async (req: Request, res: Response) => {
  const gameId = req.params.id;
  const gameRepository = await getRepository(Game);

  try {
    const game = await gameRepository.findOneOrFail(gameId);
    await gameRepository.remove(game);
    res.status(204).send();
  } catch (e) {
    res.status(404).send();
  }
};

export const getCategoriesSelection: RequestHandler<{}, string[]> = async (_, res) => {
  const categoriesListResponse: string[] = [];
  const indexes: number[] = [];
  for (let i = 0; i <= 3; ++i) {
    const chosenIndex: number = Math.floor(Math.random() * categoriesList.length);
    if (indexes.includes(chosenIndex)) {
      i--;
      continue;
    }
    categoriesListResponse.push(categoriesList[chosenIndex].name);
    indexes.push(chosenIndex);
  }
  res.status(200).send(categoriesListResponse);
};

export const submitAnswer = async (req: Request, res: Response) => {
  const gameQuestionRepo = getRepository(GameQuestion);
  const answerRepo = getRepository(Answer);
  const roundRepo = getRepository(Round);
  const gameRepo = getRepository(Game);

  const token = req.body.headers.Authorization;
  const decodedToken = (await Authentication.verifyToken(token)) as JWTToken;

  const gameQuestionsRequest = req.body.body.gameQuestion as ICreateGameQuestionResponseBody[];

  const isSecond = req.body.body.isSecond;

  const round = await roundRepo.findOneOrFail(req.body.body.roundId);

  const game = await gameRepo.findOneOrFail(round.game.id);

  const isCreator: boolean = game.creator.id === decodedToken.id;

  const gameQuestionsPromises = gameQuestionsRequest.map(async (q): Promise<GameQuestion> => {
    const question = await gameQuestionRepo.findOneOrFail(q.id);

    const chosenAnswerRequest = q.answers.find((a) => a.playerClickedAnswer === true) as IAnswerResponse;

    const chosenAnswer = await answerRepo.findOneOrFail({
      where: {
        text: chosenAnswerRequest.text,
      },
    });

    isCreator ? (question.answerCreator = chosenAnswer) : (question.answerOpponent = chosenAnswer);
    return question;
  });

  const gameQuestions = await Promise.all(gameQuestionsPromises);

  round.gameQuestions = gameQuestions;

  await gameQuestionRepo.save(gameQuestions);
  round.creatorIsPlaying = !round.creatorIsPlaying;
  let isGameDone: boolean = false;

  if (isSecond) {
    round.isActive = false;
    determineRoundWinner(round, game.creator.id, game.opponent.id);
    if (round.roundNumber < 4) await activateNextRound(round);
    else isGameDone = true;
  }
  await roundRepo.save(round);

  if (isGameDone) finishGame(game.id);

  res.send('Successfully submitted answers');
};

const activateNextRound = async (currentRound: Round) => {
  const roundRepo = getRepository(Round);
  const nextRound = await roundRepo.findOneOrFail({
    where: {
      game: currentRound.game.id,
      roundNumber: currentRound.roundNumber + 1,
    },
  });
  nextRound.isActive = true;
  roundRepo.save(nextRound);
};

const determineRoundWinner = (round: Round, creatorId: string, opponentId: string) => {
  let countCorrectCreator: number = 0;
  let countCorrectOpponent: number = 0;
  round.gameQuestions?.forEach((gq) => {
    gq.answerCreator.isCorrect && ++countCorrectCreator;
    gq.answerOpponent.isCorrect && ++countCorrectOpponent;
  });

  countCorrectCreator === countCorrectOpponent
    ? (round.roundWinnerId = 'draw')
    : countCorrectCreator > countCorrectOpponent
    ? (round.roundWinnerId = creatorId)
    : (round.roundWinnerId = opponentId);
};

const finishGame = async (gameId: string) => {
  const gameRepo = getRepository(Game);
  const game = await gameRepo.findOneOrFail(gameId);

  game.gameWinner = await determineWinner(game);

  game.gameWinner != 'draw' &&
    calculateElo(
      game.gameWinner === game.creator.id ? game.creator : game.opponent,
      game.gameWinner === game.creator.id ? game.opponent : game.creator,
    );

  await gameRepo.save(game);
};

const calculateElo = async (winner: Player, loser: Player) => {
  const e1 = Math.pow(10, winner.eloRanking / 400);
  const e2 = Math.pow(10, loser.eloRanking / 400);

  const newWinnerElo = winner.eloRanking + 32 * (1 - e1 / (e1 + e2));
  const newLoserElo = loser.eloRanking + 32 * (0 - e2 / (e1 + e2));

  winner.eloRanking = newWinnerElo;
  loser.eloRanking = newLoserElo;

  await getRepository(Player).save([winner, loser]);
};

const determineWinner = async (game: Game): Promise<string> => {
  const roundRepo = getRepository(Round);
  let roundsWonCreator: number = 0;
  let roundsWonOpponent: number = 0;

  let winnerId: string;

  const rounds = await roundRepo.find({
    where: {
      game: game.id,
    },
  });
  rounds.forEach((round) => {
    round.roundWinnerId === game.creator.id && ++roundsWonCreator;
    round.roundWinnerId === game.opponent.id && ++roundsWonOpponent;
  });

  roundsWonCreator === roundsWonOpponent
    ? (winnerId = 'draw')
    : roundsWonCreator > roundsWonOpponent
    ? (winnerId = game.creator.id)
    : (winnerId = game.opponent.id);

  return winnerId;
};
