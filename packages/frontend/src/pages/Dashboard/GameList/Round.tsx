import React from 'react';
import Popup from 'reactjs-popup';
import { Button } from '../../../components/Input/Button';
import { theme } from '../../../theme';
import { GameModal } from '../GameModal/GameModal';
import { gameWonState } from './GameComponent';
import { Round } from './GameList';

type RoundItemPros = {
  creatorId: string;
  opponentId: string;
  roundWon: string;
  roundCategory: string;
  round: Round;
  isCreator: boolean;
};

function checkStateButton(isActive: boolean, isCreator: boolean, creatorIsPlaying: boolean): boolean {
  let state: boolean = true;
  if (!isActive) {
    state = true;
  } else if ((isCreator && creatorIsPlaying) || (!isCreator && !creatorIsPlaying)) {
    state = false;
  }
  return state;
}

const RoundItem: React.FC<RoundItemPros> = ({ creatorId, opponentId, roundWon, roundCategory, round, isCreator }) => {
  return (
    <Popup
      modal={true}
      nested={true}
      trigger={
        <Button
          disabled={checkStateButton(round.isActive, isCreator, round.creatorIsPlaying)}
          style={{
            borderRadius: theme.sizes.borderRadius_5,
            opacity: checkStateButton(round.isActive, isCreator, round.creatorIsPlaying) ? '30%' : '100%',
            backgroundColor:
              roundWon === gameWonState.NA
                ? 'cornflowerblue'
                : roundWon === gameWonState.WON
                ? theme.colors.primary
                : round.roundWinnerId === 'draw'
                ? theme.colors.shadowColor
                : theme.colors.danger,
            margin: '0.2em',
          }}
        >
          {roundCategory}
        </Button>
      }
      contentStyle={{
        borderRadius: theme.sizes.borderRadius_5,
        height: '50%',
        overflow: 'auto',
        width: '80%',
        backgroundColor: theme.colors.listBackgroundColor,
        border: '0px',
        boxShadow: '0px 0px 15px 3px rgba(0,0,0,0.62)',
      }}
    >
      {(close) => (
        <div className="stats_modal">
          <div>
            <button className="close" onClick={close}>
              &times;
            </button>
          </div>
          <GameModal creatorId={creatorId} opponentId={opponentId} round={round} close={close} />
        </div>
      )}
    </Popup>
  );
};

export default RoundItem;
