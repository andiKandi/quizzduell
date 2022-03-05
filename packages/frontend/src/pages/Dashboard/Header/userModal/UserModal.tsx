import React, { FC, useContext } from 'react';
import Popup from 'reactjs-popup';
import { authContext } from '../../../../contexts/AuthenticationContext';
import { FavoriteOpponents } from './statsChart/FavoriteOpponent';
import { WinStats } from './statsChart/WinStats';
import { theme } from '../../../../theme';
import { Button } from '../../../../components/Input/Button';
import LeaderboardChart from './LeaderboardChart';
import { IconsMenu } from './IconsMenu';

interface IUserPageProps {
  handleChangePlayerIcon: (iconName: string) => void;
}

export const UserModal: FC<IUserPageProps> = ({ handleChangePlayerIcon }) => {
  const { token, actions } = useContext(authContext);

  const getPlayerId = () => {
    return JSON.parse(atob(token!.split('.')[1])).id as string;
  };

  const {
    actions: { logout },
  } = useContext(authContext);
  const onLogout = () => {
    actions.getSocket()!.emit('remove_id', getPlayerId());
    logout();
    actions.getSocket()!.close();
  };
  return (
    <div style={{ padding: '20px' }}>
      <Popup
        modal={true}
        nested={true}
        trigger={<Button>Edit Icon</Button>}
        contentStyle={{ overflow: 'auto', width: '60%' }}
      >
        {(close) => (
          <div className="stats_modal">
            <button className="close" onClick={close}>
              &times;
            </button>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <IconsMenu closeModal={close} handleChangePlayerIcon={handleChangePlayerIcon} />
            </div>
          </div>
        )}
      </Popup>
      <Popup
        modal={true}
        nested={true}
        trigger={<Button>Stats</Button>}
        contentStyle={{ height: '75%', overflow: 'auto', width: '75%' }}
      >
        {(close: React.MouseEventHandler<HTMLButtonElement>) => (
          <div className="stats_modal">
            <button className="close" onClick={close}>
              &times;
            </button>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <FavoriteOpponents />
              <WinStats />
            </div>
          </div>
        )}
      </Popup>
      <Popup
        modal={true}
        nested={true}
        trigger={<Button>Leaderboard</Button>}
        contentStyle={{ height: 'auto', overflow: 'auto', width: '75%' }}
      >
        {(close: React.MouseEventHandler<HTMLButtonElement>) => (
          <div className="leaderboard_modal">
            <button className="close" onClick={close}>
              &times;
            </button>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <LeaderboardChart />
            </div>
          </div>
        )}
      </Popup>

      <Button style={{ backgroundColor: theme.colors.danger }} onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
};
