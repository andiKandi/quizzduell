import React from 'react';
import { GameItem } from './GameList';
import styled from 'styled-components';
import RoundItem from './Round';
import { theme } from '../../../theme';

export enum gameWonState {
  NA = 'NA',
  WON = 'WON',
  LOST = 'LOST',
}

type GameItemProps = {
  game: GameItem;
};

const OpponentName = styled.div`
  background-color: darkgoldenrod;
  color: #ffffff;
  line-height: 22.4px;
  padding: 13.2px 26.4px;
  text-align: center;
  width: 100%;
  font-weight: 500;
  margin: 0.2em;
`;

export const GameComponent: React.FC<GameItemProps> = ({ game }) => {
  const getPlayerId = () => {
    const token = window.localStorage.getItem('auth-token') as string;
    return JSON.parse(atob(token.split('.')[1])).id as string;
  };

  const winStatus = (winnerId: string) => {
    if (winnerId === getPlayerId()) return gameWonState.WON;
    if (winnerId !== getPlayerId() && winnerId !== '') return gameWonState.LOST;
    return gameWonState.NA;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignContent: 'space-between',
        justifyContent: 'space-between',
        opacity: game.gameWinner != null ? '50%' : '100%',
      }}
    >
      <OpponentName
        style={{
          backgroundColor:
            game.gameWinner != null
              ? game.gameWinner === getPlayerId()
                ? theme.colors.primary
                : game.gameWinner === 'draw'
                ? theme.colors.shadowColor
                : theme.colors.danger
              : 'none',
        }}
      >
        Opponent: {game.creator.id === getPlayerId() ? game.opponent.name : game.creator.name}
      </OpponentName>
      <RoundItem
        creatorId={game.creator.id}
        opponentId={game.opponent.id}
        roundWon={winStatus(game.rounds[0].roundWinnerId)}
        roundCategory={game.rounds[0].categoryName}
        round={game.rounds[0]}
        isCreator={game.creator.id === getPlayerId()}
      />
      <RoundItem
        creatorId={game.creator.id}
        opponentId={game.opponent.id}
        roundWon={winStatus(game.rounds[1].roundWinnerId)}
        roundCategory={game.rounds[1].categoryName}
        round={game.rounds[1]}
        isCreator={game.creator.id === getPlayerId()}
      />
      <RoundItem
        creatorId={game.creator.id}
        opponentId={game.opponent.id}
        roundWon={winStatus(game.rounds[2].roundWinnerId)}
        roundCategory={game.rounds[2].categoryName}
        round={game.rounds[2]}
        isCreator={game.creator.id === getPlayerId()}
      />
      <RoundItem
        creatorId={game.creator.id}
        opponentId={game.opponent.id}
        roundWon={winStatus(game.rounds[3].roundWinnerId)}
        roundCategory={game.rounds[3].categoryName}
        round={game.rounds[3]}
        isCreator={game.creator.id === getPlayerId()}
      />
    </div>
  );
};
