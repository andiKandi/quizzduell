import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import Popup from 'reactjs-popup';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../../../../components/Input/Button';
import { InputContainer, InputField, InputLabel } from '../../../../components/Input/Input';
import { authContext } from '../../../../contexts/AuthenticationContext';
import { theme } from '../../../../theme';

export type Message = {
  id: string;
  from: string;
  message: string;
};

type MessageProps = {
  from: string;
  message: string;
};

type MessagePopupProps = {
  messages: Message[];
  id: string;
  name: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  allMessages: Message[];
};

const Message: React.FC<MessageProps> = ({ from, message }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          borderStyle: 'dotted',
          borderRadius: theme.sizes.borderRadius_5,
          margin: theme.sizes.margin_5,
          overflow: 'auto',
        }}
      >
        <h3 style={{ color: 'black', margin: '0' }}>{from}</h3>
        <p style={{ color: 'black' }}>{message}</p>
      </div>
    </>
  );
};

export const MessagePopup: React.FC<MessagePopupProps> = ({ messages, id, name, setMessages, allMessages }) => {
  const [message, setMessage] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  const { token, actions } = useContext(authContext);

  const getPlayerId = () => {
    return JSON.parse(atob(token!.split('.')[1])).id as string;
  };

  actions.getSocket()!.on('new_message', (data) => {
    const message: Message = {
      from: data.fromPlayerId,
      message: data.message,
      id: uuidv4(),
    };

    setMessages([...allMessages, message]);
  });

  actions.getSocket()!.on('user_is_online', (data) => {
    setIsOnline(data.online);
  });

  const sendMessage = async () => {
    (document?.getElementById('header-message') as HTMLInputElement).value = '';
    setMessages([
      ...allMessages,
      {
        message: message,
        id: id,
        from: 'Me',
      },
    ]);
    actions.getSocket()!.emit('send_message', {
      fromPlayer: getPlayerId(),
      toPlayer: id,
      message: message,
    });
  };

  return (
    <Popup
      modal={true}
      nested={true}
      trigger={
        <span style={{ margin: '0.5em', marginLeft: 'auto' }}>
          <FontAwesomeIcon icon={faComment} />
        </span>
      }
      onOpen={() => {
        actions.getSocket()!.emit('is_user_online', id);
      }}
      contentStyle={{
        backgroundColor: theme.colors.listBackgroundColor,
        height: '50%',
        overflow: 'auto',
        width: '80%',
        display: 'flex',
        placeContent: 'center',
        border: '0',
        boxShadow: '0px 0px 15px 3px rgba(0,0,0,0.62)',
        borderRadius: theme.sizes.borderRadius_5,
      }}
    >
      {
        <div className="modal" style={{ width: '100%' }}>
          {isOnline && (
            <>
              <div style={{ width: '100%', height: '50%', overflow: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {messages.length > 0 &&
                    messages.map((m) => {
                      return <Message from={m.from === 'Me' ? 'Me' : name} message={m.message} />;
                    })}
                </div>
              </div>
              <div style={{ bottom: 0, position: 'absolute', width: '96%', marginLeft: '0.1em' }}>
                <InputContainer>
                  <InputField
                    type="text"
                    id="header-message"
                    name="header-message"
                    placeholder={' '}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                    style={{ margin: '10px', width: 'unset' }}
                    required
                  />
                  <InputLabel htmlFor={'header-message'}>{'Message here'}</InputLabel>
                </InputContainer>
                <Button onClick={sendMessage}>Send</Button>
              </div>
            </>
          )}

          {!isOnline && <h3>User is offline</h3>}
        </div>
      }
    </Popup>
  );
};
