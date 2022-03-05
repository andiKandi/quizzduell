import React, { useState, useContext, useEffect, FC } from 'react';
import { authContext } from '../../../contexts/AuthenticationContext';
import { GameComponent } from './GameComponent';
import { theme } from '../../../theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';

export type Round = {
  id: string;
  roundNumber: number;
  categoryName: string;
  game: GameItem;
  isActive: boolean;
  creatorIsPlaying: boolean;
  roundWinnerId: string;
  isSecond: boolean;
};

export type Player = {
  id: string;
  name: string;
  eloRanking: number;
};

export type GameItem = {
  id: string;
  creator: Player;
  opponent: Player;
  gameWinner: string;
  isGameOver: boolean;
  rounds: Round[];
};

export const GameList: FC = () => {
  const [games, setGames] = useState<GameItem[]>();
  const { token, actions } = useContext(authContext);
  const playerId = JSON.parse(atob(token!.split('.')[1])).id as string;
  const queryString = `?creatorId=${playerId}`;

  const fetchGames = async () => {
    const gamesRequest = await fetch(`/api/game${queryString}`, {
      headers: { 'content-type': 'application/json' },
    });
    if (gamesRequest.status < 400) {
      const responseGames = (await gamesRequest.json()).games as GameItem[];
      setGames(responseGames);
    }
  };

  useEffect(() => {
    fetchGames();
    actions.getSocket()!.on('gameEvent', () => {
      console.log('got Here');
      fetchGames();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      style={{
        background: theme.colors.listBackgroundColor,
        width: '100%',
        padding: '1em',
        borderRadius: theme.sizes.borderRadius_5,
        minWidth: '35em',
      }}
      className={'gameList'}
    >
      <h3>
        My Games
        <FontAwesomeIcon
          style={{ color: 'white', alignSelf: 'center', marginLeft: theme.sizes.margin_5 }}
          icon={faGamepad}
        />
      </h3>
      <div style={{ overflow: 'auto', height: '35em' }}>
        {games?.map((game) => {
          return <GameComponent game={game} key={game.id} />;
        })}
      </div>
    </section>
  );
};
