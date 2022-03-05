import React, { useContext, useEffect, useState } from 'react';
// tslint:disable-next-line: no-submodule-imports
import styled, { css } from 'styled-components/macro';
import { Logo } from './Logo';
import { authContext } from '../contexts/AuthenticationContext';
import { Stats } from '../pages/Dashboard/Header/Stats';
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import axios from 'axios';
import { UserModal } from '../pages/Dashboard/Header/userModal/UserModal';
import { Button } from './Input/Button';
import { theme } from '../theme';

export const TextButton = styled.button`
  all: unset;
  color: ${(props) => props.theme.colors.primary};
  pointer: click;
  cursor: pointer;
  margin: 1em;
`;

export const MaxWidthCSS = css`
  max-width: 860px;
  margin: auto;
`;
const Header = styled.header`
  height: ${theme.wholePage.headerHeight};
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 25px;
`;

const Main = styled.main`
  min-height: calc(100vh - ${theme.wholePage.headerHeight} - ${theme.wholePage.footerHeight});
  padding: 0 25px;
`;

const Footer = styled.footer`
  height: ${theme.wholePage.footerHeight};
  padding: 0 25px;
  ${MaxWidthCSS};
`;

const NavigationList = styled.ul`
  list-style: none;
`;

export const Layout: React.FC = ({ children }) => {
  const { token } = useContext(authContext);
  const [playerIcon, setPlayerIcon] = useState();
  const playerName = JSON.parse(atob((token as string).split('.')[1])).name as string;

  const changePlayerIcon = async (iconName: string) => {
    await axios
      .put(
        '/api/user/icon',
        {
          iconName: iconName,
        },
        { headers: { Authorization: token } },
      )
      .then((res) => {
        setPlayerIcon(res.data);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      const playerId = JSON.parse(atob((token as string).split('.')[1])).id as string;
      await axios.get(`/api/user/${playerId}/icon`).then((res) => {
        setPlayerIcon(res.data);
      });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header>
        <Logo />
        <NavigationList>
          <Popup
            modal={true}
            nested={true}
            trigger={
              <Button>
                {playerIcon && (
                  <FontAwesomeIcon size="2x" style={{ margin: '0 1rem 0 0' }} icon={`${playerIcon}` as IconName} />
                )}
                {playerName}
              </Button>
            }
            contentStyle={{
              borderRadius: theme.sizes.borderRadius_5,
              overflow: 'auto',
              width: 'auto',
              backgroundColor: theme.colors.listBackgroundColor,
              border: '0px',
              boxShadow: '0px 0px 15px 3px rgba(0,0,0,0.62)',
            }}
          >
            {(close: React.MouseEventHandler<HTMLButtonElement>) => (
              <div className="stats_modal">
                <button className="close" onClick={close}>
                  &times;
                </button>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <UserModal handleChangePlayerIcon={changePlayerIcon} />
                </div>
              </div>
            )}
          </Popup>
        </NavigationList>
      </Header>
      <Main>
        <Stats />
        {children}
      </Main>
      <Footer>© 2021 QuizzDuell</Footer>
    </>
  );
};
