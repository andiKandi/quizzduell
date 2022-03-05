import React, { useContext, useEffect, useState } from 'react';
import { authContext } from '../../../../../contexts/AuthenticationContext';
import Chart from 'react-apexcharts';
import { theme } from '../../../../../theme';

interface IOpp {
  name: string;
  games: number;
}

export const FavoriteOpponents: React.FC = () => {
  const { token } = useContext(authContext);
  const playerId = JSON.parse(atob(token!.split('.')[1])).id as string;

  const [favoriteOpponents, setFavoriteOpponents] = useState<IOpp[]>([]);

  // fetches names of 10 players most often played against
  const fetchFavoriteOpponents = async () => {
    const queryString = `?playerId=${playerId}`;
    const favoriteOpponentsRequest = await fetch(`/api/stats/getOpponentStats${queryString}`, {
      headers: { 'content-type': 'application/json' },
    });
    if (favoriteOpponentsRequest.status < 400) {
      const favs = await favoriteOpponentsRequest.json();
      setFavoriteOpponents(favs);
    }
  };

  useEffect(() => {
    fetchFavoriteOpponents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return React.createElement(Chart, {
    type: 'bar',
    series: [
      {
        name: 'Wins',
        data: favoriteOpponents.slice(0, 10).map((opp) => {
          return opp.games;
        }),
      },
    ],
    height: 275,
    options: {
      chart: {
        type: 'bar',
        // tslint:disable-next-line:object-literal-sort-keys
        height: 380,
      },
      plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'bottom',
          },
        },
      },
      colors: [
        '#33b2df',
        '#546E7A',
        '#d4526e',
        '#13d8aa',
        '#A5978B',
        '#2b908f',
        '#f9a3a4',
        '#90ee7e',
        '#f48024',
        '#69d2e7',
      ],
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          colors: [theme.colors.fontColor],
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 1,
        colors: [theme.colors.fontColor],
      },
      xaxis: {
        categories: favoriteOpponents.map((opp) => {
          return opp.name;
        }),
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      title: {
        text: 'Favorite Opponents',
        align: 'center',
        floating: true,
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return '';
            },
          },
        },
      },
    },
  });
};
