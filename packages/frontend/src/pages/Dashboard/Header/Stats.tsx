import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faTrophy, faUniversity, faAward, faDice } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { authContext } from '../../../contexts/AuthenticationContext';
import { theme } from '../../../theme';

const Div = styled.div`
  margin: 0.8em;
`;

type TextProps = {
  text: string;
  value: number | string;
  icon: IconDefinition;
};

const Text: React.FC<TextProps> = ({ text, value, icon }) => {
  return (
    <>
      <Div className={'games_played'} style={{ display: 'block' }}>
        <div style={{ textAlign: 'center', fontSize: '2em' }}>{value}</div>
        <div style={{ textAlign: 'center' }}>
          <FontAwesomeIcon style={{ color: 'white', alignSelf: 'center', marginLeft: '5px' }} icon={icon} />
          <div>{text}</div>
        </div>
      </Div>
    </>
  );
};

export const Stats: React.FC = () => {
  const { token, actions } = useContext(authContext);
  const queryString = `?playerId=${JSON.parse(atob(token!.split('.')[1])).id}`;

  const [gamesPlayed, setGamesPlayed] = useState<number>(0);
  const [playerRanking, setPlayerRanking] = useState<number>(0);
  const [bestCategory, setBestCategory] = useState<string>('none');
  const [winRatio, setWinRatio] = useState<number>();

  const fetchStats = async () => {
    const statsRequest = await fetch(`/api/stats/dashboardStats${queryString}`, {
      headers: { 'content-type': 'application/json' },
    });
    if (statsRequest.status < 400) {
      const statsJSON = await statsRequest.json();

      setGamesPlayed(statsJSON.gamesPlayed);
      setPlayerRanking(statsJSON.eloRanking === undefined ? 0 : statsJSON.eloRanking);
      setBestCategory(
        statsJSON.bestCategory[0]?.categoryName === undefined ? 'n/a' : statsJSON.bestCategory[0].categoryName,
      );
      setWinRatio(statsJSON.winRatio === null ? 0 : statsJSON.winRatio);
    }
  };

  actions.getSocket()!.on('updateStats', () => {
    fetchStats();
  });

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        style={{
          display: 'flex',
          background: theme.colors.listBackgroundColor,
          width: '100%',
          padding: '1em',
          borderRadius: theme.sizes.borderRadius_5,
          marginBottom: theme.sizes.margin_5,
          minWidth: '35em',
        }}
      >
        <section
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            background: '#404040',
            borderRadius: theme.sizes.borderRadius_5,
            width: '100%',
          }}
        >
          <Text text={'Games Played'} value={gamesPlayed} icon={faDice} />
          <Text text={'Ranking'} value={playerRanking} icon={faUniversity} />
          <Text text={'Best Category'} value={bestCategory} icon={faAward} />
          <Text text={'Win Ratio'} value={winRatio + '%'} icon={faTrophy} />
        </section>
      </div>
    </>
  );
};
