import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { theme } from '../../../../theme';
import { Player } from '../../GameList/GameList';
interface ILeader {
  name: string;
  eloRanking: number;
}

export const LeaderboardChart: React.FC = () => {
  const [leaders, setLeaders] = useState<ILeader[]>([]);

  const fetchTopTen = async () => {
    const topTenRequest = await fetch(`/api/stats/topTen`, {
      headers: { 'content-type': 'application/json' },
    });
    if (topTenRequest.status < 400) {
      const topTenResponse = (await topTenRequest.json()) as Player[];
      const topTen: ILeader[] = topTenResponse.map((player) => {
        return { name: player.name, eloRanking: player.eloRanking };
      });
      setLeaders(topTen);
    }
  };

  // sorted descending
  const sortedLeaders: ILeader[] = React.useMemo(
    () =>
      leaders.sort((curr, next) => {
        return next.eloRanking - curr.eloRanking;
      }),
    [leaders],
  );

  useEffect(() => {
    fetchTopTen();
  }, []);

  return React.createElement(Chart, {
    type: 'bar',
    series: [
      {
        name: 'Wins',
        data: sortedLeaders.slice(0, 10).map((leader) => {
          return leader.eloRanking;
        }),
      },
    ],
    height: 275,
    options: {
      chart: {
        type: 'bar',
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
        categories: leaders.map((leader) => {
          return leader.name;
        }),
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      title: {
        text: 'Best of the Best',
        align: 'center',
        floating: true,
      },
      subtitle: {
        text: 'This magnificent beasts roam the world!',
        align: 'center',
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

export default LeaderboardChart;
