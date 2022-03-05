import React, { useState } from 'react';
import { ProSidebar, Menu, SubMenu } from 'react-pro-sidebar';
import { FriendItem, Friend } from './FriendItem';
import { theme } from '../../../../theme';
import { Message } from './Message';

export type FriendListProps = {
  friends: Friend[];
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
};

function mapMessages(messages: Message[], id: string): Message[] {
  const fromMessages = messages.filter((m) => m.from === id || m.id === id);
  return fromMessages as Message[];
}

export const FriendList: React.FC<FriendListProps> = ({ friends, setFriends }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          background: theme.colors.listBackgroundColor,
          width: '100%',
          maxHeight: '100%%',
          padding: '1em',
          borderRadius: theme.sizes.borderRadius_5,
          marginBottom: theme.sizes.margin_5,
        }}
      >
        <ProSidebar
          collapsed={false}
          collapsedWidth={'auto'}
          style={{ zIndex: 'auto', marginTop: '0', background: theme.colors.listBackgroundColor, height: 'auto' }}
        >
          <Menu>
            <SubMenu style={{ alignSelf: 'flex-start' }} defaultOpen={true} title="Friend List">
              {friends.map((f) => {
                return (
                  <FriendItem
                    onFinished={() => {}}
                    friend={f}
                    friends={friends}
                    setFriends={setFriends}
                    key={f.id}
                    messages={mapMessages(messages, f.id)}
                    setMessages={setMessages}
                    allMessages={messages}
                  />
                );
              })}
            </SubMenu>
          </Menu>
        </ProSidebar>
      </div>
    </>
  );
};
