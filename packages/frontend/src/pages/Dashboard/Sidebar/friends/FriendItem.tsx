import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { MenuItem } from 'react-pro-sidebar';
// tslint:disable-next-line:no-submodule-imports
import 'react-pro-sidebar/dist/css/styles.css';
import { TextButton } from '../../../../components/Layout';
import { theme } from '../../../../theme';
import '../styles/sidebar.css';
import { IconName, library } from '@fortawesome/fontawesome-svg-core';
import {
  faTrash,
  faUser,
  faUserAstronaut,
  faUserGraduate,
  faUserInjured,
  faUserNurse,
  faUserSecret,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { authContext } from '../../../../contexts/AuthenticationContext';
import { Message, MessagePopup } from './Message';

export type Friend = {
  id: string;
  name: string;
};

type FriendItemProps = {
  friend?: Friend;
  friends: Friend[];
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
  onFinished: () => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  allMessages: Message[];
};

export const FriendItem: React.FC<FriendItemProps> = ({
  friend,
  friends,
  setFriends,
  onFinished,
  messages,
  setMessages,
  allMessages,
}) => {
  library.add(faTrash, faUser, faUserTie, faUserNurse, faUserSecret, faUserGraduate, faUserInjured, faUserAstronaut);

  const [playerIcon, setPlayerIcon] = useState();
  const { actions } = useContext(authContext);

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`/api/user/${friend?.id}/icon`).then((res) => {
        setPlayerIcon(res.data);
      });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPlayerId = () => {
    const token = window.localStorage.getItem('auth-token') as string;
    return JSON.parse(atob(token.split('.')[1])).id as string;
  };

  const onRemoveClick = async () => {
    const respone = await fetch(`api/friends/${getPlayerId()}/${(friend as Friend).id}`, {
      method: 'DELETE',
    });
    const status = (await respone.json()).status;
    if (status === 'ok') {
      const newFriendList = friends.filter((f) => {
        return f.id !== (friend as Friend).id;
      });
      setFriends(newFriendList);
    }
    const friendId: string = (friend as Friend).id;
    actions.getSocket()!.emit('addOrDeleteFriend', friendId);
    onFinished();
  };

  const onChallengeClick = async () => {
    const creatorId = getPlayerId();
    const opponentId = friend?.id;
    await fetch(`api/game/`, {
      body: JSON.stringify({ creatorId: getPlayerId(), opponentId: friend?.id }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    actions.getSocket()!.emit('newGame', { creatorId, opponentId });
  };

  return (
    <div style={{ display: 'flex', margin: theme.sizes.margin_5, padding: 0, justifyContent: 'spread-around' }}>
      {playerIcon && (
        <div
          style={{
            margin: theme.sizes.margin_5,
          }}
        >
          <FontAwesomeIcon icon={`${playerIcon}` as IconName} />
        </div>
      )}
      <MenuItem
        style={{
          content: 'none !important',
          maxWidth: '15em',
          minWidth: '10em',
          overflow: 'auto',
        }}
        className={(friend as Friend).id}
      >
        {(friend as Friend).name}
      </MenuItem>
      <MessagePopup
        messages={messages}
        id={friend?.id as string}
        name={friend?.name as string}
        setMessages={setMessages}
        allMessages={allMessages}
      />
      <span
        onClick={onRemoveClick}
        style={{
          color: theme.colors.danger,
          cursor: 'pointer',
          margin: theme.sizes.margin_5,
        }}
      >
        <FontAwesomeIcon icon={faTrash} />
      </span>
      <TextButton
        onClick={onChallengeClick}
        style={{ margin: theme.sizes.margin_5, cursor: 'pointer', alignSelf: 'center' }}
      >
        Challenge
      </TextButton>
    </div>
  );
};
