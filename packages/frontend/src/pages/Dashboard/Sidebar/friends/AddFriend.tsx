import React, { ChangeEvent, useState } from 'react';
import { Friend } from './FriendItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Popup from 'reactjs-popup';
import { NewFriend } from './NewFriend';
import _ from 'lodash';
import { theme } from '../../../../theme';
import { AddFriendButton } from '../../../../components/Input/Button';
import { InputContainer, InputField, InputLabel } from '../../../../components/Input/Input';

type FriendItemProps = {
  friend?: Friend;
  friends: Friend[];
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
};

export const AddFriend: React.FC<FriendItemProps> = ({ friends, setFriends }) => {
  const getPlayerId = () => {
    const token = window.localStorage.getItem('auth-token') as string;
    return JSON.parse(atob(token.split('.')[1])).id as string;
  };

  const [newFriends, setNewFriends] = useState<Friend[]>([]);

  const [showMessage, setShowMessage] = useState(false);

  const [value, setValue] = useState({
    text: '',
    disabled: true,
  });

  const fieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      setValue({
        text: e.target.value,
        disabled: false,
      });
    } else {
      setValue({
        text: e.target.value,
        disabled: true,
      });
    }
  };

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const respone = await fetch(`api/user/getFriends/${value.text}`, {
      method: 'GET',
    });
    const result = (await respone.json()).friends as Friend[];
    if (result) {
      let list = _.differenceBy(result, friends, 'id');
      list = list.filter((f) => {
        return f.id !== getPlayerId();
      });
      setShowMessage(list.length === 0);
      setNewFriends(list);
    }

    const form = document?.getElementById('search-friend-form') as HTMLFormElement;
    form.reset();
  };

  return (
    <div
      style={{
        display: 'flex',
        background: theme.colors.listBackgroundColor,
        width: '100%',
        padding: '1em',
        borderRadius: theme.sizes.borderRadius_5,
        marginBottom: theme.sizes.margin_5,
        justifyContent: 'center',
      }}
    >
      <form
        id={'search-friend-form'}
        onSubmit={onSubmitForm}
        method="get"
        style={{ display: 'inline-grid', width: '100%' }}
      >
        <InputContainer>
          <InputField
            type="text"
            id="header-search"
            name="searchFriend"
            placeholder={' '}
            onChange={fieldChange}
            style={{ margin: '10px', width: 'unset' }}
            required
          />
          <InputLabel htmlFor={'header-search'}>{'Search friend'}</InputLabel>
        </InputContainer>
        <Popup
          modal={true}
          nested={true}
          disabled={value.disabled}
          trigger={
            <AddFriendButton type="submit">
              Search <FontAwesomeIcon icon={faSearch} />
            </AddFriendButton>
          }
          contentStyle={{
            backgroundColor: theme.colors.listBackgroundColor,
            height: 'auto',
            overflow: 'auto',
            width: 'auto',
            minWidth: '15em',
            maxWidth: '25em',
            display: 'flex',
            justifyItems: 'stretch',
            justifyContent: 'space-around',
            border: '0',
            boxShadow: '0px 0px 15px 3px rgba(0,0,0,0.62)',
            borderRadius: theme.sizes.margin_5,
          }}
        >
          {(close: React.MouseEventHandler<HTMLButtonElement>) => (
            <div className="modal_friends" style={{ width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {newFriends.map((f) => {
                  return (
                    <NewFriend
                      onFinished={(event: any) => close(event)}
                      friend={f}
                      friends={friends}
                      setFriends={setFriends}
                      key={f.id}
                    />
                  );
                })}

                {showMessage && <h3>No match is found</h3>}
              </div>
            </div>
          )}
        </Popup>
      </form>
    </div>
  );
};
