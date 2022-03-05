import React, { useEffect, useContext, useState } from 'react';
import Chart from 'react-apexcharts';
import { authContext } from '../../../../../contexts/AuthenticationContext';
import { theme } from '../../../../../theme';

type GameStats = {
  wins: number;
  losses: number;
  draws: number;
};

export const WinStats: React.FC = () => {
  const { token } = useContext(authContext);
  const playerId = JSON.parse(atob(token!.split('.')[1])).id as string;

  const [winStats, setWinStats] = useState<GameStats>({ wins: 0, losses: 0, draws: 0 });

  // fetches number of: wins, losses, draws
  const fetchWinRatio = async () => {
    const queryString = `?playerId=${playerId}`;
    const gamesRequest = await fetch(`/api/stats${queryString}`, {
      headers: { 'content-type': 'application/json' },
    });
    if (gamesRequest.status < 400) {
      const gamesJSON: GameStats = await gamesRequest.json();
      setWinStats({ wins: gamesJSON.wins, losses: gamesJSON.losses, draws: gamesJSON.draws });
    }
  };

  useEffect(() => {
    fetchWinRatio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allNull: boolean = winStats.wins === 0 && winStats.losses === 0 && winStats.draws === 0;
  return React.createElement(Chart, {
    type: 'pie',
    series: allNull ? [1, 0, 0] : [winStats.wins, winStats.losses, winStats.draws],
    height: 275,
    options: {
      chart: {
        width: 275,
      },
      title: {
        text: 'Win Ratio',
        align: 'center',
        floating: false,
      },
      labels: ['Won', 'Lost', 'Draw'],
      legend: {
        position: 'bottom',
      },
      colors: [theme.colors.primary, theme.colors.danger, '#404040'],
    },
  });
};
