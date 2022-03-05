import React, { useState, useContext } from 'react';
import Popup from 'reactjs-popup';
import { authContext } from '../../../contexts/AuthenticationContext';
// tslint:disable-next-line:no-submodule-imports
import ClipLoader from 'react-spinners/ClipLoader';
import { ClockLoader } from 'react-spinners';
import Countdown from 'react-countdown';
import { theme } from '../../../theme';
import { Button, MatchMakingButton } from '../../../components/Input/Button';

export const MatchMaking = () => {
  const { actions } = useContext(authContext);

  const getPlayerId = () => {
    const token = window.localStorage.getItem('auth-token') as string;
    return JSON.parse(atob(token.split('.')[1])).id as string;
  };

  actions.getSocket()!.on('match_making_close', () => {
    onComplete();
  });

  let remove = true;

  const [loading, setLoading] = useState({
    isLoading: true,
    text: 'loading...',
  });

  const [matchMakingPolling, setMatchMakingPolling] = useState(false);

  const [isFound, setIsFound] = useState(false);

  const onMatchMakingClick = async () => {
    const respone = await fetch(`api/matchMaking/${getPlayerId()}`, {
      method: 'GET',
    });

    const randomGame = (await respone.json()).data;
    if (randomGame.opponentName) {
      setLoading({ text: `You're now playing against ${randomGame.opponentName as string}`, isLoading: false });
      setIsFound(true);
      actions.getSocket()!.emit('newGame', { creatorId: getPlayerId(), opponentId: randomGame.opponentId });
      actions.getSocket()!.emit('match_making_found', { opponentId: randomGame.opponentId });
    } else {
      setLoading({ text: `Currently no player available`, isLoading: false });
      setIsFound(false);
    }
  };

  const onComplete = async () => {
    if (remove) {
      await fetch(`api/matchMaking/${getPlayerId()}`, {
        method: 'DELETE',
      });
    }

    remove = true;
    setMatchMakingPolling(false);
  };

  const onAbortClick = () => {
    onComplete();
  };

  const renderer = ({ formatted: { minutes, seconds } }) => {
    return (
      <span>
        {minutes as string}:{seconds as string}
      </span>
    );
  };

  return (
    <>
      <div
        style={{
          background: theme.colors.listBackgroundColor,
          display: 'flex',
          width: '100%',
          padding: '1em',
          borderRadius: theme.sizes.borderRadius_5,
          marginBottom: theme.sizes.margin_5,
        }}
      >
        {!matchMakingPolling && (
          <Popup
            modal={true}
            nested={true}
            trigger={<MatchMakingButton style={{ alignSelf: 'center', flex: 1 }}>Matchmaking</MatchMakingButton>}
            onOpen={async () => {
              await onMatchMakingClick();
            }}
            contentStyle={{
              backgroundColor: theme.colors.listBackgroundColor,
              height: '40%',
              overflow: 'auto',
              padding: '0.5 em',
              maxWidth: '30%',
              minWidth: '20em',
              display: 'flex',
              placeContent: 'center',
              borderRadius: theme.sizes.borderRadius_5,
              border: 0,
              boxShadow: '0px 0px 15px 3px rgba(0,0,0,0.62)',
            }}
          >
            {(close: React.MouseEventHandler<HTMLButtonElement>) => (
              <div className="stats_modal" style={{ alignSelf: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <ClipLoader color={'#5691f0'} loading={loading.isLoading} size={100} />
                  <p style={{ color: 'white', textAlign: 'center' }}>{loading.text}</p>
                  {!loading.isLoading && (
                    <div style={{ display: 'flex', placeContent: 'center', margin: '30px' }}>
                      <Button
                        style={{ marginRight: '30px' }}
                        onClick={(e: any) => {
                          close(e);
                          setLoading({
                            text: 'loading...',
                            isLoading: true,
                          });
                        }}
                      >
                        CLOSE
                      </Button>
                      {!isFound && (
                        <Button
                          onClick={(e: any) => {
                            close(e);
                            setMatchMakingPolling(true);
                            setLoading({
                              text: 'loading...',
                              isLoading: true,
                            });
                          }}
                        >
                          WAIT for next player
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Popup>
        )}
        {matchMakingPolling && (
          <>
            <MatchMakingButton onClick={onAbortClick} style={{ alignSelf: 'center', flex: 1 }}>
              Abort
            </MatchMakingButton>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px', marginRight: '10px' }}>
              <ClockLoader css={'align-self: center; margin:10px'} color={'#5691f0'} loading={true} size={20} />
              <Countdown
                css={{ alignSelf: 'center', margin: '30px' }}
                renderer={renderer}
                onComplete={onComplete}
                date={Date.now() + 600000}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};
