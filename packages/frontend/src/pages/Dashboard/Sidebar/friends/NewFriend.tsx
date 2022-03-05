import React, { useContext } from 'react';
import { Friend } from './FriendItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { AddFriendButton } from '../../../../components/Input/Button';
import { authContext } from '../../../../contexts/AuthenticationContext';

type FriendItemProps = {
  friend?: Friend;
  friends: Friend[];
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
  onFinished: (event: any) => void;
};

export const NewFriend: React.FC<FriendItemProps> = ({ friend, friends, setFriends, onFinished }) => {
  const { actions } = useContext(authContext);

  const getPlayerId = () => {
    const token = window.localStorage.getItem('auth-token') as string;
    return JSON.parse(atob(token.split('.')[1])).id as string;
  };

  const onClickAdd = async () => {
    const respone = await fetch(`api/friends/${getPlayerId()}/${(friend as Friend).id}`, {
      method: 'POST',
    });
    const newFriend = (await respone.json()).data;

    const friendId = (friend as Friend).id;

    actions.getSocket()!.emit('addOrDeleteFriend', friendId);

    if (newFriend) {
      setFriends([...friends, friend as Friend]);
    }
  };

  return (
    <div
      className={'friend'}
      style={{ display: 'flex', margin: '15px', justifyContent: 'space-between' }}
      id={(friend as Friend).id}
    >
      <label htmlFor={'add-friend-button'} style={{ color: 'white', margin: '10px', cursor: 'pointer', flex: 1 }}>
        {(friend as Friend).name}
      </label>
      <AddFriendButton
        id={'add-friend-button'}
        style={{ padding: 0, width: 'fit-content' }}
        onClick={(event) => {
          onClickAdd();
          onFinished(event);
        }}
      >
        <FontAwesomeIcon style={{ color: 'white', alignSelf: 'center', margin: '10px' }} icon={faUserPlus} />
      </AddFriendButton>
    </div>
  );
};
