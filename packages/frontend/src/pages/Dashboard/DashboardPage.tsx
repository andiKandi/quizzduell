import React, { useContext, useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { authContext } from '../../contexts/AuthenticationContext';
import { FriendList } from './Sidebar/friends/FriendList';
// tslint:disable-next-line:no-submodule-imports
import 'reactjs-popup/dist/index.css';
import { AddFriend } from './Sidebar/friends/AddFriend';
import { Friend } from './Sidebar/friends/FriendItem';
import { GameList } from './GameList/GameList';
import { MatchMaking } from './Sidebar/MatchMaking';
import { theme } from '../../theme';

export const DashboardPage = () => {
  const { token, actions } = useContext(authContext);
  const id = JSON.parse(atob((token as string).split('.')[1])).id as string;

  const [friends, setFriends] = useState<Friend[]>([]);

  const fetchData = async () => {
    const respone = await fetch(`api/friends/${id}`, {
      method: 'GET',
    });
    const result = (await respone.json()).data as Friend[];
    setFriends(result);
  };

  actions.getSocket()!.on('addOrDeleteFriend', () => {
    fetchData();
  });

  useEffect(() => {
    actions.getSocket()!.emit('signIn', id);

    actions.getSocket()!.on('server', () => {
      console.log('hallo from server');
    });

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            marginBottom: theme.sizes.margin_5,
            marginRight: theme.sizes.margin_5,
          }}
        >
          <GameList />
        </div>
        <section className={'friendsList'}>
          <MatchMaking />
          <AddFriend friends={friends} setFriends={setFriends} />
          <FriendList friends={friends} setFriends={setFriends} />
        </section>
      </div>
    </Layout>
  );
};
